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

from schema import schema

from .models import User, Puzzle

onlineViewerCount = 0

# {{{ unsolvedListQuery
unsolvedListQuery = """
  query {
    allPuzzles (status: 0, orderBy: "-modified") {
      edges {
        node {
          id
          ...PuzzleList_node
        }
      }
    }
  }"""
# }}}
# {{{ unsolvedListElementQuery
unsolvedListElementQuery = """
  query {
    puzzle (id: "%s") {
      id
      ...PuzzleList_node
    }
  }
"""
# }}}
# {{{ puzzleListNodeFragment
puzzleListNodeFragment = """
  fragment PuzzleList_node on PuzzleNode {
    id
    rowid
    genre
    title
    status
    created
    quesCount
    uaquesCount
    starSet {
      edges {
        node {
          value
        }
      }
    }
    user {
      ...components_user
    }
  }"""
# }}}
# {{{ componentsUserFragment
componentsUserFragment = """
  fragment components_user on UserNode {
    rowid
    nickname
    currentAward {
      id
      created
      award {
        id
        name
        description
      }
    }
  }
"""

# }}}
# {{{ Standalones
unsolvedListQueryStandalone = unsolvedListQuery + puzzleListNodeFragment + componentsUserFragment
unsolvedListElementQueryStandalone = unsolvedListElementQuery + puzzleListNodeFragment + componentsUserFragment

# }}}


# {{{1 Constants
ADD_PUZZLE = "ws/ADD_PUZZLE"
PUZZLE_CONNECT = "ws/PUZZLE_CONNECT"
PUZZLE_DISCONNECT = "ws/PUZZLE_DISCONNECT"

PUZZLE_ADDED = "ws/NEW_PUZZLE_ADDED"
PUZZLE_UPDATED = "ws/NEW_PUZZLE_UPDATED"

VIEWER_CONNECT = "ws/VIEWER_CONNECT"
VIEWER_DISCONNECT = "ws/VIEWER_DISCONNECT"

UPDATE_ONLINE_VIEWER_COUNT = "ws/UPDATE_ONLINE_VIEWER_COUNT"
# }}}


class PuzzleListUpdater(JsonWebsocketConsumer):
    strict_ordering = False
    http_user_and_session = True
    groupName = "puzzleList"

    def connection_groups(self, **kwargs):
        return [self.groupName]

    def connect(self, message, **kwargs):
        print("puzzlelist connected")

    def disconnect(self, message, **kwargs):
        print("puzzlelist disconnected")

    def receive(self, content, multiplexer, **kwargs):
        print("puzzlelist received", content)
        if content.get("type") == UPDATE_PUZZLE:
            multiplexer.send(self.update_puzzle(content))
        elif content.get("type") == ADD_PUZZLE:
            self.add_puzzle(content, multiplexer)
        elif content.get("type") == PUZZLE_CONNECT:
            self.send_all_puzzle(multiplexer)
        elif content.get("type") == PUZZLE_DISCONNECT:
            self.close()

    def add_puzzle(self, content, multiplexer):
        global unsolvedListElementQueryStandalone
        results = schema.execute(
            unsolvedListElementQueryStandalone % content["puzzleId"])
        if results.errors: print(results.errors)
        else:
            self.group_send(self.groupName, {
                "type": PREPEND_PUZZLE_LIST,
                "puzzleNode": results.data
            })

    def update_puzzle(self, content):
        print(content)
        return {}

    def send_all_puzzle(self, multiplexer):
        global unsolvedListQueryStandalone
        results = schema.execute(unsolvedListQueryStandalone)
        multiplexer.send({
            "type": INIT_PUZZLE_LIST,
            "data": results.data,
            "errors": results.errors
        })

@receiver(post_save, sender=Puzzle)
def send_update(sender, instance, created, *args, **kwargs):
    puzzleId = str(instance.id)
    if created:
        Group("viewer").send({
            "type": PUZZLE_ADDED,
            "data": { "rowid": puzzleId }
        })
    else:
        Group("puzzle-show.%d" % puzzleId).send({
            "type": PUZZLE_UPDATED,
            "data": { "rowid": puzzleId }
        })


class ViewerUpdater(JsonWebsocketConsumer):
    strict_ordering = False
    http_user_and_session = True
    groupName = "viewer"

    def connection_groups(self, **kwargs):
        return [self.groupName]

    def connect(self, message, multiplexer, **kwargs):
        print("view connected")
        global onlineViewerCount
        onlineViewerCount += 1
        if not message.user.is_anonymous:
            message.user.online = True
            message.user.save()

    def disconnect(self, message, multiplexer, **kwargs):
        print("view disconnected")
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
        "puzzleList": PuzzleListUpdater,
    }
