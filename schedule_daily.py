'''isort:skip_file'''
import os
import logging
import yaml
from datetime import timedelta
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")

import django
django.setup()
from django.utils import timezone

from awards import judgers, granters
from sui_hei.models import Award, ChatMessage, ChatRoom, Puzzle, User, DirectMessage

logger = logging.getLogger(name=__file__)
logging.basicConfig(datefmt="%Y/%m/%d %H:%M:%S", level=logging.DEBUG)


def feedBot(message):
    try:
        message = message.strip()
        user = User.objects.get(username="System")
        lobby = ChatRoom.objects.get(name="lobby")
        if message:
            message = "My Work Today\n" + '=' * 20 + '\n' + message
            ChatMessage(chatroom=lobby, user=user, content=message).save()

    except Exception as e:
        logger.debug(e)


def clean_recent_minichat(chatroomName="lobby", recent=None):
    cr = ChatRoom.objects.get(name=chatroomName)
    cr_messages = cr.chatmessage_set.order_by("id")
    count = cr_messages.count()

    logger.debug("[ChatRoom:%s]: Total count: %s" % (chatroomName, count))
    if not isinstance(recent, int):
        logger.debug("[ChatRoom:%s]: Delete all objects" % chatroomName)
        cr.chatmessage_set.delete()
    else:
        logger.debug("[ChatRoom:%s]: Leaving message count: %s" % (chatroomName, recent))

    if count < recent:
        return

    try:
        earliest = cr_messages[count - recent].id
    except IndexError:
        return

    to_delete = cr_messages.filter(id__lt=earliest)
    logger.debug("[ChatRoom:%s]: Deleting %s objects" % (chatroomName, to_delete.count()))
    to_delete.delete()


def clean_recent_directmessages(recent=90):
    now = timezone.now()
    recent_days_ago = now - timedelta(days=recent)
    outdated = DirectMessage.objects.filter(created__lt=recent_days_ago)
    logger.debug("[DirectMessage]: Reserve messages in recent %d days" % recent)
    logger.debug("[DirectMessage]: Deleting %s objects" % outdated.count())
    outdated.delete()


def mark_puzzle_as_dazed(recent=14):
    now = timezone.now()
    recent_days_ago = now - timedelta(days=recent)
    unsolved = Puzzle.objects.filter(status=0, modified__lt=recent_days_ago)
    for dazed_puzzle in unsolved:
        logger.debug("[Puzzle]: Mark dazed:", dazed_puzzle.id, "-", dazed_puzzle.title)
        dazed_puzzle.status = 2
        dazed_puzzle.modified = now
        dazed_puzzle.save()


if __name__ == "__main__":
    settings = {}
    if os.path.exists('./schedule_settings.yml'):
        with open("./schedule_settings.yml") as f:
            settings = yaml.load(f)

    # delete old minichat chat messages
    for chatroomName, recent in settings.get(
            'chatroom_messages_preserve_count', {}).items():
        clean_recent_minichat(chatroomName, recent)

    # delete old direct messages
    recent = settings.get('direct_message_preserve_days', None)
    if isinstance(recent, int):
        clean_recent_directmessages(recent)

    # mark outdated puzzles as dazed
    #daily_message = ""
    #returned = mark_puzzle_as_dazed(14)
    #if returned:
    #    daily_message += "## Dazed Soup :coffee:\n" + '- ' + '\n- '.join(
    #        returned.split('\n')) + '\n'

    # Don't feed to Bot in favor of notification.
    #feedBot(daily_message)
