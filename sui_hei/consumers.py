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
from channels.auth import channel_session_user
from channels.generic.websockets import JsonWebsocketConsumer
from channels.handler import AsgiHandler
from django.contrib.auth.models import AnonymousUser
from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver
from graphql_relay import from_global_id, to_global_id

from schema import schema

from .models import Dialogue, Hint, Minichat, Puzzle, User

onlineViewerCount = 0

# {{{1 Constants
PUZZLE_CONNECT = "app/containers/PuzzleShowPage/PUZZLE_SHOWN"
PUZZLE_DISCONNECT = "app/containers/PuzzleShowPage/PUZZLE_HID"

PUZZLE_ADDED = "ws/PUZZLE_ADDED"
PUZZLE_UPDATED = "ws/PUZZLE_UPDATED"
DIALOGUE_ADDED = "ws/DIALOGUE_ADDED"
DIALOGUE_UPDATED = "ws/DIALOGUE_UPDATED"
HINT_ADDED = "ws/HINT_ADDED"
HINT_UPDATED = "ws/HINT_UPDATED"
MINICHAT_ADDED = "ws/MINICHAT_ADDED"
MINICHAT_UPDATED = "ws/MINICHAT_UPDATED"

VIEWER_CONNECT = "ws/VIEWER_CONNECT"
VIEWER_DISCONNECT = "ws/VIEWER_DISCONNECT"

MINICHAT_CONNECT = "ws/MINICHAT_CONNECT"
MINICHAT_DISCONNECT = "ws/MINICHAT_DISCONNECT"

UPDATE_ONLINE_VIEWER_COUNT = "ws/UPDATE_ONLINE_VIEWER_COUNT"
# }}}


@receiver(post_save, sender=Dialogue)
def send_dialogue_update(sender, instance, created, *args, **kwargs):
    dialogueId = instance.id
    if created:
        text = json.dumps({
            "type": DIALOGUE_ADDED,
            "data": {
                "id": to_global_id('DialogueNode', dialogueId),
            }
        })
        print("Send", text)
        Group("puzzle-%d" % instance.puzzle.id).send({"text": text})
    else:
        text = json.dumps({
            "type": DIALOGUE_UPDATED,
            "data": {
                "id": to_global_id('DialogueNode', dialogueId)
            }
        })
        print("Send", text)
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
        print("Send", text)
        Group("viewer").send({"text": text})
    else:
        text = json.dumps({
            "type": PUZZLE_UPDATED,
            "data": {
                "id": to_global_id('PuzzleNode', puzzleId)
            }
        })
        print("Send", text)
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
        print("Send", text)
        Group("puzzle-%s" % puzzleId).send({"text": text})
    else:
        text = json.dumps({
            "type": HINT_UPDATED,
            "data": {
                "id": to_global_id('HintNode', hintId),
            }
        })
        print("Send", text)
        Group("puzzle-%s" % puzzleId).send({"text": text})


@receiver(post_save, sender=Minichat)
def send_minichat_update(sender, instance, created, *args, **kwargs):
    minichatId = instance.id
    if created:
        text = json.dumps({
            "type": MINICHAT_ADDED,
            "data": {
                "id": to_global_id('MinichatNode', minichatId),
            }
        })
        print("Send", text)
        Group("minichat-%s" % minichatId).send({"text": text})
    else:
        text = json.dumps({
            "type": MINICHAT_UPDATED,
            "data": {
                "id": to_global_id('MinichatNode', minichatId),
            }
        })
        print("Send", text)
        Group("minichat-%s" % minichatId).send({"text": text})


def broadcast_status():
    global onlineViewerCount
    #onlineUsers = User.objects.filter(online=True)
    text = json.dumps({
        "type": UPDATE_ONLINE_VIEWER_COUNT,
        "data": {
            "onlineViewerCount": onlineViewerCount
        }
    })
    Group("viewer").send({"text": text})


@channel_session_user
def ws_connect(message):
    message.reply_channel.send({"accept": True})
    Group("viewer").add(message.reply_channel)

    global onlineViewerCount
    onlineViewerCount += 1

    if not message.user.is_anonymous:
        message.user.online = True
        message.user.save()


@channel_session_user
def ws_disconnect(message):
    Group("viewer").discard(message.reply_channel)

    global onlineViewerCount
    onlineViewerCount -= 1

    if not message.user.is_anonymous:
        message.user.online = False
        message.user.save()

    broadcast_status()


@channel_session_user
def ws_message(message):
    print("Received", message.content["text"])
    data = json.loads(message.content["text"])

    if data.get("type") == VIEWER_CONNECT:
        broadcast_status()
    elif data.get("type") == VIEWER_DISCONNECT:
        Group("viewer").discard(message.reply_channel)
        broadcast_status()
    elif data.get("type") == PUZZLE_CONNECT:
        Group("puzzle-%s" % data["data"]["puzzleId"])\
                .add(message.reply_channel)
    elif data.get("type") == PUZZLE_DISCONNECT:
        Group("puzzle-%s" % data["data"]["puzzleId"])\
                .discard(message.reply_channel)
    elif data.get("type") == MINICHAT_CONNECT:
        Group("minichat-%s" % data["channel"]).add(message.reply_channel)
    elif data.get("type") == MINICHAT_DISCONNECT:
        Group("minichat-%s" % data["channel"]).discard(message.reply_channel)
