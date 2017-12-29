'''isort:skip_file'''
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")
from datetime import timedelta

import django
django.setup()
from django.utils import timezone

from scoring import update_user_exp
from awards import judgers, granters
from sui_hei.models import Award, Lobby, Mondai, User

daily_message = ""


def feedBot(message):
    try:
        message = message.strip()
        user = User.objects.get(username="System")
        if message:
            message = "My Work Today\n" + '=' * 20 + '\n' + message + '\n' + '=' * 20
            Lobby(channel="lobby", user_id=user, content=message).save()
        else:
            Lobby(
                channel="lobby",
                user_id=user,
                content="Today is my holiday :)").save()

    except Exception as e:
        print(e)


def clean_recent_lobby(recent=None):
    if not isinstance(recent, int):
        return

    count = Lobby.objects.filter(channel="lobby").count()
    if count < recent:
        return

    try:
        earliest = Lobby.objects.filter(channel="lobby")[count - recent].id
    except IndexError:
        return

    Lobby.objects.filter(channel="lobby", id__lt=earliest).delete()


def mark_mondai_as_dazed(recent=7):
    message = ""

    now = timezone.now()
    recent_days_ago = now - timedelta(days=recent)
    unsolved = Mondai.objects.filter(status=0, modified__lt=recent_days_ago)
    for dazed_mondai in unsolved:
        print("Mark dazed: ", dazed_mondai.id, "-", dazed_mondai.title)
        message += "%s - %s\n" % (dazed_mondai.id, dazed_mondai.title)
        dazed_mondai.status = 2
        dazed_mondai.modified = now
        dazed_mondai.save()

    return message


def grant_awards_to_users(recent=None):
    message = ""

    if recent:
        users = User.objects.filter(
            last_login__gt=timezone.now() - recent).all()
    else:
        users = User.objects.all()

    for key, judger in judgers.items():
        returned = judger.execAll(users).strip()
        if returned:
            message += "### Award Group: **" + key + "**\n"
            message += '- ' + '\n- '.join(returned.split('\n')) + '\n'

    for key, granter in granters.items():
        returned = granter().strip()
        if returned:
            message += "### Award Group: **" + key + "**\n"
            message += '- ' + '\n- '.join(returned.split('\n')) + '\n'

    return message


if __name__ == "__main__":
    # Update user experience
    update_user_exp(recent=timedelta(days=1))

    # delete old lobby chat messages
    clean_recent_lobby(200)

    # mark outdated mondais as dazed
    returned = mark_mondai_as_dazed(7)
    if returned:
        daily_message += "## Dazed Soup :coffee:\n" + '- ' + '\n- '.join(
            returned.split('\n')) + '\n'

    # grant awards to users
    returned = grant_awards_to_users(recent=timedelta(days=1))
    if returned:
        daily_message += "## Awards :crown:\n" + returned + '\n'

    feedBot(daily_message)
