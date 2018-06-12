import logging

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from twitter import OAuth, Twitter

from sui_hei.models import Puzzle

ENABLE_TWITTERBOT = settings.ENABLE_TWITTERBOT
TOKEN = settings.TOKEN
TOKEN_SECRET = settings.TOKEN_SECRET
CONSUMER_KEY = settings.CONSUMER_KEY
CONSUMER_SECRET = settings.CONSUMER_SECRET
TWEET_MESSAGE = settings.TWEET_MESSAGE
TWEET_WITH_PICTURE = settings.TWEET_WITH_PICTURE

logger = logging.Logger(__name__)


@receiver(post_save, sender=Puzzle)
def add_twitter_on_puzzle_created(sender, instance, created, **kwargs):
    if created and ENABLE_TWITTERBOT:
        try:
            auth = OAuth(TOKEN, TOKEN_SECRET, CONSUMER_KEY, CONSUMER_SECRET)
            t = Twitter(auth=auth)

            params = {
                'status': TWEET_MESSAGE % {
                    'user_nickname': instance.user.nickname,
                    'title': instance.title,
                    'id': instance.id
                },
            }

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
