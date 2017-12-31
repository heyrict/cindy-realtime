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

from schema import schema

from .models import User

onlineViewerCount = 0

# {{{ unsolvedListQuery
unsolvedListQuery = """
  query {
    allMondais (status: 0, orderBy: "-modified") {
      edges {
        node {
          id
          ...MondaiList_node
        }
      }
    }
  }"""
# }}}
# {{{ unsolvedListElementQuery
unsolvedListElementQuery = """
  query {
    mondai (id: "%s") {
      id
      ...MondaiList_node
    }
  }
"""
# }}}
# {{{ mondaiListNodeFragment
mondaiListNodeFragment = """
  fragment MondaiList_node on MondaiNode {
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
unsolvedListQueryStandalone = unsolvedListQuery + mondaiListNodeFragment + componentsUserFragment
unsolvedListElementQueryStandalone = unsolvedListElementQuery + mondaiListNodeFragment + componentsUserFragment

# }}}


class SoupListUpdater(JsonWebsocketConsumer):
    strict_ordering = False
    http_user_and_session = True
    groupName = "soupList"

    def connection_groups(self, **kwargs):
        return [self.groupName]

    def connect(self, message, **kwargs):
        print("souplist connected")

    def disconnect(self, message, **kwargs):
        print("souplist disconnected")

    def receive(self, content, multiplexer, **kwargs):
        print("souplist received", content)
        if content.get("type") == "UPDATE_SOUP":
            multiplexer.send(self.update_soup(content))
        elif content.get("type") == "ADD_SOUP":
            self.add_soup(content, multiplexer)
        elif content.get("type") == "SOUP_CONNECT":
            self.send_all_soup(multiplexer)
        elif content.get("type") == "SOUP_DISCONNECT":
            self.close()

    def add_soup(self, content, multiplexer):
        global unsolvedListElementQueryStandalone
        results = schema.execute(
            unsolvedListElementQueryStandalone % content["soupId"])
        if results.errors: print(results.errors)
        else:
            self.group_send(self.groupName, {
                "type": "PREPEND_SOUP_LIST",
                "soupNode": results.data
            })

    def update_soup(self, content):
        print(content)
        return {}

    def send_all_soup(self, multiplexer):
        global unsolvedListQueryStandalone
        results = schema.execute(unsolvedListQueryStandalone)
        if results.errors: print(results.errors)
        else:
            multiplexer.send({
                "type": "INIT_SOUP_LIST",
                "soupList": results.data
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
        if content.get("type") == "VIEWER_CONNECT":
            self.broadcast_status()
        elif content.get("type") == "VIEWER_DISCONNECT":
            self.close()

    def broadcast_status(self):
        global onlineViewerCount
        #onlineUsers = User.objects.filter(online=True)
        self.group_send(self.groupName, {
            "type": "UPDATE_ONLINE_VIEWER_COUNT",
            "onlineViewerCount": onlineViewerCount
        })


class Demultiplexer(WebsocketDemultiplexer):
    '''
    Demultiplexer. Accepts { stream : soupList, payload: content }
    '''
    consumers = {
        "viewer": ViewerUpdater,
        "soupList": SoupListUpdater,
    }
