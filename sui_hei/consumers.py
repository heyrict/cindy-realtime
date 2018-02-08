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

import asyncio
import json
import logging

from asgiref.sync import AsyncToSync
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from graphql_relay import from_global_id, to_global_id

from schema import schema

from .models import ChatMessage, Dialogue, Hint, Puzzle, User

logger = logging.getLogger(__name__)

# {{{1 Constants
PUZZLE_CONNECT = "app/containers/PuzzleShowPage/PUZZLE_SHOWN"
PUZZLE_DISCONNECT = "app/containers/PuzzleShowPage/PUZZLE_HID"

PUZZLE_ADDED = "ws/PUZZLE_ADDED"
PUZZLE_UPDATED = "ws/PUZZLE_UPDATED"
SET_CURRENT_USER = "app/UserNavbar/SET_CURRENT_USER"
DIALOGUE_ADDED = "ws/DIALOGUE_ADDED"
DIALOGUE_UPDATED = "ws/DIALOGUE_UPDATED"
HINT_ADDED = "ws/HINT_ADDED"
HINT_UPDATED = "ws/HINT_UPDATED"
CHATMESSAGE_ADDED = "ws/CHATMESSAGE_ADDED"
CHATMESSAGE_UPDATED = "ws/CHATMESSAGE_UPDATED"

VIEWER_CONNECT = "ws/VIEWER_CONNECT"
VIEWER_DISCONNECT = "ws/VIEWER_DISCONNECT"

CHATROOM_CONNECT = "ws/CHATROOM_CONNECT"
CHATROOM_DISCONNECT = "ws/CHATROOM_DISCONNECT"

SEND_DIRECTCHAT = "ws/SEND_DIRECTCHAT"
DIRECTCHAT_RECEIVED = "ws/DIRECTCHAT_RECEIVED"

UPDATE_ONLINE_VIEWER_COUNT = "ws/UPDATE_ONLINE_VIEWER_COUNT"


# }}}
class MainConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("viewer", self.channel_name)

        onlineUsers = cache.get("onlineUsers", {})
        self.user = self.scope['user']
        if not self.user.is_anonymous:
            await self.channel_layer.group_add("User-%s" % self.user.id,
                                               self.channel_name)
            onlineUsers.update({
                str(self.channel_name): (self.user.id, self.user.nickname)
            })
            cache.set("onlineUsers", onlineUsers, None)

        onlineUserCount = cache.get("onlineUserCount", 0)
        cache.set("onlineUserCount", onlineUserCount + 1, None)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("viewer", self.channel_name)

        onlineUsers = cache.get("onlineUsers", {})
        if str(self.channel_name) in onlineUsers.keys():
            await self.channel_layer.group_discard(
                "User-%s" % onlineUsers[str(self.channel_name)][0],
                self.channel_name)
            onlineUsers.pop(str(self.channel_name))
            cache.set('onlineUsers', onlineUsers, None)

        onlineUserCount = cache.get("onlineUserCount", 0)
        cache.set("onlineUserCount", onlineUserCount - 1, None)

        await self.broadcast_status()

    async def broadcast_status(self):
        onlineUsers = cache.get("onlineUsers", {})
        onlineUserList = dict(set(onlineUsers.values()))
        text = {
            "type": UPDATE_ONLINE_VIEWER_COUNT,
            "data": {
                "onlineViewerCount": cache.get('onlineUserCount', 0),
                "onlineUsers": onlineUserList
            }
        }
        await self.channel_layer.group_send("viewer", {
            "type": "viewer.message",
            "content": text,
        })

    async def viewer_message(self, event):
        print("SEND:", event['content'])
        await self.send_json(event["content"])

    async def receive_json(self, content):
        print("RECEIVE:", content)
        if content.get("type") == VIEWER_CONNECT:
            await self.broadcast_status()
        elif content.get("type") == VIEWER_DISCONNECT:
            self.channel_layer.group_discard("viewer", self.channel_name)
            await self.broadcast_status()
        elif content.get("type") == SET_CURRENT_USER:
            await self.user_change(content)
        elif content.get("type") == PUZZLE_CONNECT:
            self.channel_layer.group_add(
                "puzzle-%s" % content["data"]["puzzleId"], self.channel_name)
        elif content.get("type") == PUZZLE_DISCONNECT:
            self.channel_layer.group_discard(
                "puzzle-%s" % content["data"]["puzzleId"], self.channel_name)
        elif content.get("type") == CHATROOM_CONNECT:
            self.channel_layer.group_add("chatroom-%s" % content["channel"],
                                         self.channel_name)
        elif content.get("type") == CHATROOM_DISCONNECT:
            self.channel_layer.group_discard(
                "chatroom-%s" % content["channel"], self.channel_name)
        elif content.get("type") == SEND_DIRECTCHAT:
            content["type"] = DIRECTCHAT_RECEIVED
            await self.channel_layer.group_send(
                "User-%s" % content["data"]["to"], {
                    "type": "viewer.message",
                    "content": content
                })

    async def user_change(self, content):
        onlineUsers = cache.get("onlineUsers")
        onlineUsers = onlineUsers if onlineUsers else {}
        update = False

        if str(self.channel_name) in onlineUsers.keys():
            await self.channel_layer.group_discard("User-%s" % onlineUsers[str(
                self.channel_name, self.channel_name)])
            onlineUsers.pop(str(self.channel_name))
            update = True

        if content.get('currentUser') and content['currentUser']['userId']:
            await self.channel_layer.group_add(
                "User-%s" % content['currentUser']['userId'],
                self.channel_name)
            onlineUsers.update({
                str(self.channel_name): (content['currentUser']['userId'],
                                         content['currentUser']['nickname'])
            })
            update = True

        if update:
            cache.set("onlineUsers", onlineUsers, None)
            await self.broadcast_status()


@receiver(post_save, sender=Dialogue)
def send_dialogue_update(sender, instance, created, *args, **kwargs):
    dialogueId = instance.id
    puzzleId = instance.puzzle.id
    channel_layer = get_channel_layer()
    if created:
        text = {
            "type": DIALOGUE_ADDED,
            "data": {
                "id": to_global_id('DialogueNode', dialogueId),
                "puzzleId": puzzleId,
            }
        }
        logger.debug("Send %s", text)
        AsyncToSync(channel_layer.group_send)("viewer", {
            "type": "viewer.message",
            "content": text
        })
    else:
        text = {
            "type": DIALOGUE_UPDATED,
            "data": {
                "id": to_global_id('DialogueNode', dialogueId),
                "puzzleId": puzzleId,
            }
        }
        logger.debug("Send %s", text)
        AsyncToSync(channel_layer.group_send)("puzzle-%d" % instance.puzzle.id,
                                              {
                                                  "type": "viewer.message",
                                                  "content": text
                                              })


@receiver(post_save, sender=Puzzle)
def send_puzzle_update(sender, instance, created, *args, **kwargs):
    puzzleId = instance.id
    channel_layer = get_channel_layer()
    if created:
        text = {
            "type": PUZZLE_ADDED,
            "data": {
                "id": to_global_id('PuzzleNode', puzzleId),
                "title": instance.title,
                "nickname": instance.user.nickname
            }
        }
        logger.debug("Send %s", text)
        AsyncToSync(channel_layer.group_send)("viewer", {
            "type": "viewer.message",
            "content": text
        })
    else:
        text = {
            "type": PUZZLE_UPDATED,
            "data": {
                "id": to_global_id('PuzzleNode', puzzleId)
            }
        }
        logger.debug("Send %s", text)
        AsyncToSync(channel_layer.group_send)("viewer", {
            "type": "viewer.message",
            "content": text
        })


@receiver(post_save, sender=Hint)
def send_hint_update(sender, instance, created, *args, **kwargs):
    hintId = instance.id
    puzzleId = instance.puzzle.id
    channel_layer = get_channel_layer()
    if created:
        text = {
            "type": HINT_ADDED,
            "data": {
                "id": to_global_id('HintNode', hintId),
            }
        }
        logger.debug("Send %s", text)
        AsyncToSync(channel_layer.group_send)("puzzle-%s" % puzzleId, {
            "type": "viewer.message",
            "content": text
        })
    else:
        text = {
            "type": HINT_UPDATED,
            "data": {
                "id": to_global_id('HintNode', hintId),
            }
        }
        logger.debug("Send %s", text)
        AsyncToSync(channel_layer.group_send)("puzzle-%s" % puzzleId, {
            "type": "viewer.message",
            "content": text
        })


@receiver(post_save, sender=ChatMessage)
def send_chatmessage_update(sender, instance, created, *args, **kwargs):
    chatmessageId = instance.id
    channel = instance.chatroom.name
    channel_layer = get_channel_layer()
    if created:
        text = {
            "type": CHATMESSAGE_ADDED,
            "data": {
                "id": to_global_id('ChatMessageNode', chatmessageId),
            }
        }
        logger.debug("Send %s", text)
        __import__("pdb").set_trace()
        AsyncToSync(channel_layer.group_send)("chatroom-%s" % channel, {
            "type": "websocket.message",
            "content": text
        })
    else:
        text = {
            "type": CHATMESSAGE_UPDATED,
            "data": {
                "id": to_global_id('ChatMessageNode', chatmessageId),
            }
        }
        logger.debug("Send %s", text)
        AsyncToSync(channel_layer.group_send)("chatroom-%s" % channel, {
            "type": "viewer.message",
            "content": text
        })
