from channels import Channel, Group
from channels.generic.websockets import (JsonWebsocketConsumer,
                                         WebsocketDemultiplexer)
from channels.handler import AsgiHandler
from django.contrib.auth.models import AnonymousUser

from .models import User

onlineViewerCount = 0


class MondaiListUpdater(JsonWebsocketConsumer):

    strict_ordering = False
    http_user_and_session = True

    def connection_groups(self, **kwargs):
        return ["MondaiList"]

    def receive(self, content, multiplexer, **kwargs):
        if content.get("type") == "NEW_MONDAI":
            multiplexer.send(self.new_mondai(content))
        elif content.get("type") == "UPDATE_MONDAI":
            multiplexer.send(self.update_mondai(content))

    def new_mondai(self, content):
        print(content)
        return {}

    def update_mondai(self, content):
        print(content)
        return {}


class ViewerUpdater(JsonWebsocketConsumer):
    strict_ordering = False
    http_user_and_session = True
    groupName = "viewer"

    def connection_groups(self, **kwargs):
        return [self.groupName]

    def connect(self, message, multiplexer, **kwargs):
        global onlineViewerCount
        onlineViewerCount += 1
        if not message.user.is_anonymous:
            message.user.online = True
            message.user.save()

        self.broadcast_status()

    def disconnect(self, message, multiplexer, **kwargs):
        global onlineViewerCount
        onlineViewerCount -= 1
        if not message.user.is_anonymous:
            message.user.online = False
            message.user.save()

        self.broadcast_status()

    def receive(self, content, multiplexer, **kwargs):
        if content.get("type") == "GET_ALL_VIEWER":
            self.broadcast_status()

    def broadcast_status(self):
        global onlineViewerCount
        #onlineUsers = User.objects.filter(online=True)
        self.group_send( self.groupName, {
            "type": "UPDATE_ONLINE_VIEWER_COUNT",
            "onlineViewerCount": onlineViewerCount
        })


class Demultiplexer(WebsocketDemultiplexer):
    '''
    Demultiplexer. Accepts { stream : mondai, payload: content }
    '''
    consumers = {
        "viewer": ViewerUpdater,
        "mondai": MondaiListUpdater,
    }
