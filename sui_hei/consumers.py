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
import logging
import pickle

import redis
from channels import Channel, Group
from channels.auth import channel_session_user, channel_session_user_from_http
from channels.generic.websockets import JsonWebsocketConsumer
from channels.handler import AsgiHandler
from django.apps import apps
from django.contrib.auth.models import AnonymousUser
from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from graphql_relay import from_global_id, to_global_id

from cindy.settings import REDIS_HOST
from schema import schema

from .models import ChatMessage, Dialogue, Hint, Puzzle, User, UserAward
from .subscription import GraphQLObserver, GraphQLSubscriptionStore

logger = logging.getLogger(__name__)

rediscon = redis.Redis(host=REDIS_HOST["host"], port=REDIS_HOST["port"])
rediscon.set("onlineUsers", b'\x80\x03}q\x00.')

subscription_store = GraphQLSubscriptionStore()

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
USERAWARD_ADDED = "ws/USERAWARD_ADDED"

VIEWER_CONNECT = "ws/VIEWER_CONNECT"
VIEWER_DISCONNECT = "ws/VIEWER_DISCONNECT"

CHATROOM_CONNECT = "ws/CHATROOM_CONNECT"
CHATROOM_DISCONNECT = "ws/CHATROOM_DISCONNECT"

SEND_DIRECTCHAT = "ws/SEND_DIRECTCHAT"
DIRECTCHAT_RECEIVED = "ws/DIRECTCHAT_RECEIVED"

UPDATE_ONLINE_VIEWER_COUNT = "ws/UPDATE_ONLINE_VIEWER_COUNT"

# }}}


def broadcast_status():
    onlineUsers = rediscon.get("onlineUsers")
    onlineUsers = pickle.loads(onlineUsers) if onlineUsers else {}

    onlineUserList = dict(set(onlineUsers.values()))
    text = json.dumps({
        "type": UPDATE_ONLINE_VIEWER_COUNT,
        "data": {
            "onlineViewerCount": len(onlineUsers),
            "onlineUsers": onlineUserList,
        }
    })
    Group("viewer").send({"text": text})


def user_change(message):
    onlineUsers = pickle.loads(rediscon.get("onlineUsers"))
    onlineUsers = onlineUsers if onlineUsers else {}
    data = json.loads(message.content["text"])
    update = False

    if str(message.reply_channel) in onlineUsers.keys():
        Group("User-%s" % onlineUsers[str(message.reply_channel)][0]).discard(
            message.reply_channel)
        onlineUsers.pop(str(message.reply_channel))
        update = True

    if data.get('currentUser') and data['currentUser']['userId']:
        Group("User-%s" % data['currentUser']['userId']).add(
            message.reply_channel)
        onlineUsers.update({
            str(message.reply_channel): (data['currentUser']['userId'],
                                         data['currentUser']['nickname'])
        })
        update = True

    if update:
        rediscon.set("onlineUsers", pickle.dumps(onlineUsers))
        broadcast_status()


@channel_session_user_from_http
def ws_connect(message):
    message.reply_channel.send({"accept": True})
    Group("viewer").add(message.reply_channel)

    onlineUsers = rediscon.get("onlineUsers")
    onlineUsers = pickle.loads(onlineUsers) if onlineUsers else {}
    if not message.user.is_anonymous:
        Group("User-%s" % message.user.id).add(message.reply_channel)
        onlineUsers.update({
            str(message.reply_channel): (message.user.id,
                                         message.user.nickname)
        })
        rediscon.set("onlineUsers", pickle.dumps(onlineUsers))


def ws_disconnect(message):
    Group("viewer").discard(message.reply_channel)
    subscription_store.unsubscribe(message.reply_channel.name)

    onlineUsers = rediscon.get("onlineUsers")
    onlineUsers = pickle.loads(onlineUsers) if onlineUsers else {}
    if str(message.reply_channel) in onlineUsers.keys():
        Group("User-%s" % onlineUsers[str(message.reply_channel)][0]).discard(
            message.reply_channel)
        onlineUsers.pop(str(message.reply_channel))
        cache.set('onlineUsers', pickle.dumps(onlineUsers))

    broadcast_status()


@channel_session_user_from_http
def ws_message(message):
    data = json.loads(message.content["text"])

    logger.debug("RECEIVE %s", data)
    if data.get("type") == VIEWER_CONNECT:
        broadcast_status()
    elif data.get("type") == VIEWER_DISCONNECT:
        Group("viewer").discard(message.reply_channel)
        broadcast_status()
    elif data.get("type") == SET_CURRENT_USER:
        user_change(message)
    elif data.get("type") == PUZZLE_CONNECT:
        Group("puzzle-%s" % data["data"]["puzzleId"])\
                .add(message.reply_channel)
    elif data.get("type") == PUZZLE_DISCONNECT:
        Group("puzzle-%s" % data["data"]["puzzleId"])\
                .discard(message.reply_channel)
    elif data.get("type") == CHATROOM_CONNECT:
        Group("chatroom-%s" % data["channel"]).add(message.reply_channel)
    elif data.get("type") == CHATROOM_DISCONNECT:
        Group("chatroom-%s" % data["channel"]).discard(message.reply_channel)
    elif data.get("type") == SEND_DIRECTCHAT:
        data["type"] = DIRECTCHAT_RECEIVED
        Group("User-%s" % data["data"]["to"]).send({"text": json.dumps(data)})


# Graphql Subscription


def notify_on_model_changes(model):
    """
    Listen for post_save signal and send model lable with pk to `django.model_changed`
    when model is created or updated.
    """

    from django.contrib.contenttypes.models import ContentType

    def receiver(sender, instance, **kwargs):
        ct = ContentType.objects.get_for_model(sender)
        model = '.'.join([ct.app_label, ct.model])

        Channel('django.model_changed').send({
            'pk': instance.pk,
            'model': model,
        })

    post_save.connect(
        receiver,
        sender=model,
        weak=False,
        dispatch_uid='channel_model_changed')


notify_on_model_changes(Puzzle)
notify_on_model_changes(Dialogue)
notify_on_model_changes(Hint)
notify_on_model_changes(ChatMessage)


def model_changed(message):
    pk = message.content['pk']
    model = message.content['model']

    channels = subscription_store.get_subscriptions(model)
    for channel, subscriptions in channels.items():
        for subscription_id, subscriber in subscriptions.items():
            Channel('graphql.subscription').send({
                'pk':
                pk,
                'model':
                model,
                'payload':
                subscriber['payload'],
                'subscription_id':
                subscription_id,
                'reply_channel':
                channel,
            })


@channel_session_user
def graphql_subscription(message):
    model = message.content['model']
    pk = message.content['pk']

    instance = apps.get_model(model).objects.get(pk=pk)

    subscription_id = message.content['subscription_id']
    payload = message.content['payload']

    result = schema.execute(
        payload['query'],
        operation_name=payload['operationName'],
        variable_values=payload['variables'],
        root_value=instance,
        context_value=message,  # message.user is the same as request.user
        allow_subscriptions=True,
    )

    observer = GraphQLObserver(message.reply_channel, subscription_id)
    if hasattr(result, 'subscribe'):
        result.subscribe(observer)


@channel_session_user_from_http
def sub_connect(message):
    # Accept the connection
    message.reply_channel.send({"accept": True})


# Connected to websocket.receive
@channel_session_user
def sub_message(message):
    request = json.loads(message.content['text'])

    if request['type'] == 'connection_init':
        return

    elif request['type'] == 'start':
        subscription_store.subscribe(message.reply_channel.name, request['id'],
                                     request['payload'])

    elif request['type'] == 'stop':
        subscription_store.unsubscribe(
            message.reply_channel.name,
            request['id'],
        )


# Connected to websocket.disconnect
def sub_disconnect(message):
    subscription_store.unsubscribe(message.reply_channel.name)
