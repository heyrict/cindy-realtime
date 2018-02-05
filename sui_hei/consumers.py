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

from channels import Channel, Group
from channels.auth import channel_session_user_from_http
from channels.generic.websockets import JsonWebsocketConsumer
from channels.handler import AsgiHandler
from django.contrib.auth.models import AnonymousUser
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


@receiver(post_save, sender=Dialogue)
def send_dialogue_update(sender, instance, created, *args, **kwargs):
    dialogueId = instance.id
    puzzleId = instance.puzzle.id
    if created:
        text = json.dumps({
            "type": DIALOGUE_ADDED,
            "data": {
                "id": to_global_id('DialogueNode', dialogueId),
                "puzzleId": puzzleId,
            }
        })
        logger.debug("Send %s", text)
        Group("viewer").send({"text": text})
    else:
        text = json.dumps({
            "type": DIALOGUE_UPDATED,
            "data": {
                "id": to_global_id('DialogueNode', dialogueId),
                "puzzleId": puzzleId,
            }
        })
        logger.debug("Send %s", text)
        Group("puzzle-%d" % instance.puzzle.id).send({"text": text})


@receiver(post_save, sender=Puzzle)
def send_puzzle_update(sender, instance, created, *args, **kwargs):
    puzzleId = instance.id
    if created:
        text = json.dumps({
            "type": PUZZLE_ADDED,
            "data": {
                "id": to_global_id('PuzzleNode', puzzleId),
                "title": instance.title,
                "nickname": instance.user.nickname
            }
        })
        logger.debug("Send %s", text)
        Group("viewer").send({"text": text})
    else:
        text = json.dumps({
            "type": PUZZLE_UPDATED,
            "data": {
                "id": to_global_id('PuzzleNode', puzzleId)
            }
        })
        logger.debug("Send %s", text)
        Group("viewer").send({"text": text})


@receiver(post_save, sender=Hint)
def send_hint_update(sender, instance, created, *args, **kwargs):
    hintId = instance.id
    puzzleId = instance.puzzle.id
    if created:
        text = json.dumps({
            "type": HINT_ADDED,
            "data": {
                "id": to_global_id('HintNode', hintId),
            }
        })
        logger.debug("Send %s", text)
        Group("puzzle-%s" % puzzleId).send({"text": text})
    else:
        text = json.dumps({
            "type": HINT_UPDATED,
            "data": {
                "id": to_global_id('HintNode', hintId),
            }
        })
        logger.debug("Send %s", text)
        Group("puzzle-%s" % puzzleId).send({"text": text})


@receiver(post_save, sender=ChatMessage)
def send_chatmessage_update(sender, instance, created, *args, **kwargs):
    chatmessageId = instance.id
    channel = instance.chatroom.name
    if created:
        text = json.dumps({
            "type": CHATMESSAGE_ADDED,
            "data": {
                "id": to_global_id('ChatMessageNode', chatmessageId),
            }
        })
        logger.debug("Send %s", text)
        Group("chatroom-%s" % channel).send({"text": text})
    else:
        text = json.dumps({
            "type": CHATMESSAGE_UPDATED,
            "data": {
                "id": to_global_id('ChatMessageNode', chatmessageId),
            }
        })
        logger.debug("Send %s", text)
        Group("chatroom-%s" % channel).send({"text": text})


def broadcast_status():
    onlineUsers = cache.get("onlineUsers", {})
    onlineUserList = dict(set(onlineUsers.values()))
    onlineViewerCount = cache.get("onlineViewerCount", 0)
    text = json.dumps({
        "type": UPDATE_ONLINE_VIEWER_COUNT,
        "data": {
            "onlineViewerCount": onlineViewerCount,
            "onlineUsers": onlineUserList
        }
    })
    Group("viewer").send({"text": text})


def user_change(message):
    onlineUsers = cache.get("onlineUsers")
    onlineUsers = onlineUsers if onlineUsers else {}
    data = json.loads(message.content["text"])
    update = False

    if str(message.reply_channel) in onlineUsers.keys():
        Group("User-%s" % onlineUsers[str(message.reply_channel)][0]).discard(
            message.reply_channel)
        onlineUsers.pop(str(message.reply_channel))
        update = True

    if data.get('currentUser') and data['currentUser']['userId']:
        Group("User-%s" %
              data['currentUser']['userId']).add(message.reply_channel)
        onlineUsers.update({
            str(message.reply_channel): (data['currentUser']['userId'],
                                         data['currentUser']['nickname'])
        })
        update = True

    if update:
        cache.set("onlineUsers", onlineUsers, None)
    broadcast_status()


@channel_session_user_from_http
def ws_connect(message):
    message.reply_channel.send({"accept": True})
    Group("viewer").add(message.reply_channel)

    onlineUsers = cache.get("onlineUsers", {})
    if not message.user.is_anonymous:
        Group("User-%s" % message.user.id).add(message.reply_channel)
        onlineUsers.update({
            str(message.reply_channel): (message.user.id,
                                         message.user.nickname)
        })
        cache.set("onlineUsers", onlineUsers, None)

    onlineViewerCount = cache.get("onlineViewerCount")
    if onlineViewerCount: cache.incr("onlineViewerCount")
    else: cache.set("onlineViewerCount", 1)


def ws_disconnect(message):
    Group("viewer").discard(message.reply_channel)

    onlineUsers = cache.get("onlineUsers", {})
    if str(message.reply_channel) in onlineUsers.keys():
        Group("User-%s" % onlineUsers[str(message.reply_channel)][0]).discard(
            message.reply_channel)
        onlineUsers.pop(str(message.reply_channel))
        cache.set('onlineUsers', onlineUsers, None)

    onlineViewerCount = cache.get("onlineViewerCount", 0)
    if onlineViewerCount > 0: cache.decr("onlineViewerCount")
    else: cache.set("onlineViewerCount", 0)

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
