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
  }
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
  }
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


class SoupListUpdater(JsonWebsocketConsumer):
    strict_ordering = False
    http_user_and_session = True

    def connection_groups(self, **kwargs):
        return ["SoupList"]

    def connect(self, message, **kwargs):
        print("souplist connected")

    def disconnect(self, message, **kwargs):
        print("souplist disconnected")

    def receive(self, content, multiplexer, **kwargs):
        print("souplist received", content)
        if content.get("type") == "UPDATE_SOUP":
            multiplexer.send(self.update_soup(content))
        elif content.get("type") == "ADD_SOUP":
            multiplexer.send(self.add_soup(content))
        elif content.get("type") == "SOUP_CONNECT":
            self.send_all_soup(multiplexer)
        elif content.get("type") == "SOUP_DISCONNECT":
            self.close()

    def add_soup(self, content):
        print(content)
        return {}

    def update_soup(self, content):
        print(content)
        return {}

    def send_all_soup(self, multiplexer):
        global unsolvedListQuery
        results = schema.execute(unsolvedListQuery)
        if results.errors: print(results.errors)
        multiplexer.send({"type": "INIT_SOUP_LIST", "soupList": results.data})


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
