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
import functools
import json
import logging
import pickle

import redis
from asgiref.sync import AsyncToSync, async_to_sync
from channels.consumer import SyncConsumer
from channels.exceptions import StopConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from graphql_relay import from_global_id, to_global_id
from rx import Observable

from cindy.settings import REDIS_HOST
from schema import schema

from .models import ChatMessage, Dialogue, Hint, Puzzle, User, UserAward

rediscon = redis.Redis(host=REDIS_HOST["host"], port=REDIS_HOST["port"])
rediscon.set("onlineUsers", b'\x80\x03}q\x00.')

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

        onlineUsers = rediscon.get("onlineUsers")
        onlineUsers = pickle.loads(onlineUsers) if onlineUsers else {}
        self.user = self.scope['user']
        if not self.user.is_anonymous:
            await self.channel_layer.group_add("User-%s" % self.user.id,
                                               self.channel_name)
            onlineUsers.update({
                str(self.channel_name): (self.user.id, self.user.nickname)
            })
            rediscon.set("onlineUsers", pickle.dumps(onlineUsers))

        await self.broadcast_status()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("viewer", self.channel_name)

        onlineUsers = rediscon.get("onlineUsers")
        onlineUsers = pickle.loads(onlineUsers) if onlineUsers else {}
        if str(self.channel_name) in onlineUsers.keys():
            await self.channel_layer.group_discard(
                "User-%s" % onlineUsers[str(self.channel_name)][0],
                self.channel_name)
            onlineUsers.pop(str(self.channel_name))
            rediscon.set("onlineUsers", pickle.dumps(onlineUsers))

        await self.broadcast_status()

    async def broadcast_status(self):
        onlineUsers = rediscon.get("onlineUsers")
        onlineUsers = pickle.loads(onlineUsers) if onlineUsers else {}
        onlineUserList = dict(set(onlineUsers.values()))
        text = {
            "type": UPDATE_ONLINE_VIEWER_COUNT,
            "data": {
                "onlineViewerCount": len(onlineUsers),
                "onlineUsers": onlineUserList,
            }
        }
        await self.channel_layer.group_send("viewer", {
            "type": "viewer.message",
            "content": text,
        })

    async def viewer_message(self, event):
        await self.send_json(event["content"])

    async def receive_json(self, content):
        if content.get("type") == SET_CURRENT_USER:
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
        onlineUsers = rediscon.get("onlineUsers")
        onlineUsers = pickle.loads(onlineUsers) if onlineUsers else {}
        update = False

        if str(self.channel_name) in onlineUsers.keys():
            await self.channel_layer.group_discard(
                "User-%s" % onlineUsers[str(self.channel_name)][0],
                self.channel_name)
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
            rediscon.set("onlineUsers", pickle.dumps(onlineUsers))
            await self.broadcast_status()


# GraphQL types might use info.context.user to access currently authenticated user.
# When Query is called, info.context is request object,
# however when Subscription is called, info.context is scope dict.
# This is minimal wrapper around dict to mimic object behavior.
class AttrDict:
    def __init__(self, data):
        self.data = data or {}

    def __getattr__(self, item):
        return self.get(item)

    def get(self, item):
        return self.data.get(item)


class StreamObservable:
    def __call__(self, observer):
        self.observer = observer

    def send(self, value):
        if not self.observer:
            raise Exception("Can't send values to disconnected observer.")
        self.observer.on_next(value)


class GraphqlSubcriptionConsumer(SyncConsumer):
    def __init__(self, scope):
        super().__init__(scope)
        self.subscriptions = {}
        self.groups = {}

    def websocket_connect(self, message):
        self.send({"type": "websocket.accept", "subprotocol": "graphql-ws"})

    def websocket_disconnect(self, message):
        for group in self.groups.keys():
            group_discard = async_to_sync(self.channel_layer.group_discard)
            group_discard('django.%s' % group, self.channel_name)

        self.send({"type": "websocket.close", "code": 1000})
        raise StopConsumer()

    def websocket_receive(self, message):
        request = json.loads(message['text'])
        id = request.get('id')

        if request['type'] == 'connection_init':
            return

        elif request['type'] == 'start':
            payload = request['payload']
            context = AttrDict(self.scope)
            context.subscribe = functools.partial(self._subscribe, id)

            stream = StreamObservable()

            result = schema.execute(
                payload['query'],
                operation_name=payload['operationName'],
                variable_values=payload['variables'],
                context_value=context,
                root_value=Observable.create(stream).share(),
                allow_subscriptions=True,
            )
            if hasattr(result, 'subscribe'):
                result.subscribe(functools.partial(self._send_result, id))
                self.subscriptions[id] = stream
            else:
                self._send_result(id, result)

        elif request['type'] == 'stop':
            self._unsubscribe(id)
            if id in self.subscriptions:
                del self.subscriptions[id]

    def model_changed(self, message):
        model = message['model']
        pk = message['pk']

        for id in self.groups.get(model, []):
            stream = self.subscriptions.get(id)
            if not stream:
                continue
            stream.send((pk, model))

    def _subscribe(self, id, model_name):
        group = self.groups.setdefault(model_name, set())
        if not len(group):
            group_add = async_to_sync(self.channel_layer.group_add)
            group_add('django.%s' % model_name, self.channel_name)
        self.groups[model_name].add(id)

    def _unsubscribe(self, id):
        for group, ids in self.groups.items():
            if id not in ids:
                continue

            ids.remove(id)
            if not len(ids):
                # no more subscriptions for this group
                group_discard = async_to_sync(self.channel_layer.group_discard)
                group_discard('django.%s' % group, self.channel_name)

    def _send_result(self, id, result):
        errors = result.errors

        self.send({
            'type':
            'websocket.send',
            'text':
            json.dumps({
                'id': id,
                'type': 'data',
                'payload': {
                    'data': result.data,
                    'errors': list(map(str, errors)) if errors else None,
                }
            })
        })


def notify_on_model_changes(model):
    from django.contrib.contenttypes.models import ContentType
    ct = ContentType.objects.get_for_model(model)
    model_label = '.'.join([ct.app_label, ct.model])

    channel_layer = get_channel_layer()

    def receiver(sender, instance, **kwargs):
        payload = {
            'type': 'model.changed',
            'pk': instance.pk,
            'model': model_label,
        }
        async_to_sync(channel_layer.group_send)('django.%s' % model_label,
                                                payload)

    post_save.connect(
        receiver,
        sender=model,
        weak=False,
        dispatch_uid='django.%s' % model_label)


notify_on_model_changes(ChatMessage)
notify_on_model_changes(Dialogue)
notify_on_model_changes(Hint)
notify_on_model_changes(Puzzle)
