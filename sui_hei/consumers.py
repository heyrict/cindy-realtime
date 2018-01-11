"""
consumers.py

File handling websocket requests.
Most requests (except {accept: true} for connection) will be
in the form of:
    {
      type: "ACTION_CONSTANT",
      ...props
    }
, which is consistant to redux action.

The required returned form is:
    {
      type: "ACTION_CONSTANT",
      ...props
    }
, which will be directly dispatched by redux.

**DEPRECATED**:
    Both of { type, ...props } and { stream, payload: { type, ...props }}
    are valid now, should be handled with in future versions.
"""

import json

from channels import Channel, Group
from channels.generic.websockets import (JsonWebsocketConsumer,
                                         WebsocketDemultiplexer)
from channels.handler import AsgiHandler
from django.contrib.auth.models import AnonymousUser
from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from graphql_relay import from_global_id, to_global_id

from schema import schema

from .models import Puzzle, User
from .schema import PuzzleNode

onlineViewerCount = 0

# {{{1 Constants
ADD_PUZZLE = "ws/ADD_PUZZLE"
PUZZLE_CONNECT = "ws/PUZZLE_CONNECT"
PUZZLE_DISCONNECT = "ws/PUZZLE_DISCONNECT"

PUZZLE_ADDED = "ws/PUZZLE_ADDED"
PUZZLE_UPDATED = "ws/PUZZLE_UPDATED"

VIEWER_CONNECT = "ws/VIEWER_CONNECT"
VIEWER_DISCONNECT = "ws/VIEWER_DISCONNECT"

UPDATE_ONLINE_VIEWER_COUNT = "ws/UPDATE_ONLINE_VIEWER_COUNT"
# }}}


@receiver(post_save, sender=Puzzle)
def send_update(sender, instance, created, *args, **kwargs):
    puzzleId = instance.id
    print("PUZZLE UPDATE TRACKED:", instance, created)
    if created:
        Group("viewer").send({
            "text":
            json.dumps({
                "type": PUZZLE_ADDED,
                "data": {
                    "id": to_global_id(PuzzleNode.__name__, puzzleId),
                    "title": instance.title,
                    "nickname": instance.user.nickname
                }
            })
        })
    else:
        Group("viewer").send({
            "text":
            json.dumps({
                "type": PUZZLE_UPDATED,
                "data": {
                    "id": to_global_id(PuzzleNode.__name__, puzzleId)
                }
            })
        })


class ViewerUpdater(JsonWebsocketConsumer):
    strict_ordering = False
    http_user_and_session = True
    groupName = "viewer"

    def connect(self, message, multiplexer, **kwargs):
        print("view connected")
        Group(self.groupName).add(message.reply_channel)
        global onlineViewerCount
        onlineViewerCount += 1
        if not message.user.is_anonymous:
            message.user.online = True
            message.user.save()

    def disconnect(self, message, multiplexer, **kwargs):
        print("view disconnected")
        Group(self.groupName).discard(message.reply_channel)
        global onlineViewerCount
        onlineViewerCount -= 1
        if not message.user.is_anonymous:
            message.user.online = False
            message.user.save()

        self.broadcast_status()

    def receive(self, content, multiplexer, **kwargs):
        print("viewer received", content)
        if content.get("type") == VIEWER_CONNECT:
            self.broadcast_status()
        elif content.get("type") == VIEWER_DISCONNECT:
            self.close()

    def broadcast_status(self):
        global onlineViewerCount
        #onlineUsers = User.objects.filter(online=True)
        self.group_send(self.groupName, {
            "type": UPDATE_ONLINE_VIEWER_COUNT,
            "data": {
                "onlineViewerCount": onlineViewerCount
            }
        })


class Demultiplexer(WebsocketDemultiplexer):
    '''
    Demultiplexer. Accepts { stream : puzzleList, payload: content }
    '''
    consumers = {
        "viewer": ViewerUpdater,
    }
