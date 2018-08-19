import logging
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from twitter import OAuth, Twitter

ENABLE_TWITTERBOT = settings.ENABLE_TWITTERBOT
TOKEN = settings.TOKEN
TOKEN_SECRET = settings.TOKEN_SECRET
CONSUMER_KEY = settings.CONSUMER_KEY
CONSUMER_SECRET = settings.CONSUMER_SECRET
TWEET_MESSAGE = settings.TWEET_MESSAGE
TWEET_WITH_PICTURE = settings.TWEET_WITH_PICTURE
BOM_TWEET_MESSAGE = settings.BOM_TWEET_MESSAGE
BOM_RANKING_MESSAGE = settings.BOM_RANKING_MESSAGE

logger = logging.Logger(__name__)


def add_twitter_on_puzzle_created(sender, instance, created, **kwargs):
    if created and ENABLE_TWITTERBOT:
        try:
            auth = OAuth(TOKEN, TOKEN_SECRET, CONSUMER_KEY, CONSUMER_SECRET)
            t = Twitter(auth=auth)

            params = {
                'status': TWEET_MESSAGE % {
                    'user_nickname': _('Anonymous User') if instance.anonymous else instance.user.nickname,
                    'title': instance.title,
                    'id': instance.id
                },
            } # yapf: disable

            if TWEET_WITH_PICTURE:
                from imaging.puzzle_rendering import render, textify

                imgpath = render(instance.title, textify(instance.content))
                with open(imgpath, 'rb') as f:
                    imgdata = f.read()
                params['media[]'] = imgdata
                t.statuses.update_with_media(**params)
            else:
                t.statuses.update(**params)

        except Exception as e:
            logger.warning("Error update twitter status: %s" % e)


def add_twitter_on_best_of_month_determined(puzzle_list, useraward):
    try:
        from imaging import render
        auth = OAuth(TOKEN, TOKEN_SECRET, CONSUMER_KEY, CONSUMER_SECRET)
        t = Twitter(auth=auth)
        last_month = timezone.now() - timedelta(days=30)
        status_message = BOM_TWEET_MESSAGE % {
            'user_nickname': useraward.user.nickname,
            'award_name': useraward.award.name,
            'year': last_month.year,
            'month': last_month.month,
            'ranking': ''.join([
                BOM_RANKING_MESSAGE % {
                    'no': i + 1,
                    'user_nickname': puzzle_list[i].user.nickname,
                    'star__sum': puzzle_list[i].star__sum,
                    'star__count': puzzle_list[i].star__count,
                    'title': puzzle_list[i].title,
                    'id': puzzle_list[i].id,
                } for i in range(len(puzzle_list))
            ]),
        } # yapf: disable
        print(status_message)
        status_messages = status_message.split('\n\n', 1)

        imgpath = render(*status_messages)
        with open(imgpath, 'rb') as f:
            imgdata = f.read()
        params = {
            'status': status_messages[0],
            'media[]': imgdata,
        }

        t.statuses.update_with_media(**params)

    except Exception as e:
        logger.warning("Error update twitter status: %s" % e)
