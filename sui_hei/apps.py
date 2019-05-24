from django.apps import AppConfig
from django.db.models.signals import post_save
from django.utils.translation import ugettext_lazy as _

from sui_hei.signals import (add_twitter_on_puzzle_created,
                             add_twitter_on_schedule_created)


class SuiHeiConfig(AppConfig):
    name = 'sui_hei'
    verbose_name = _('Lateral Thinking')

    def ready(self):
        from sui_hei.models import Puzzle, Schedule
        post_save.connect(add_twitter_on_puzzle_created, sender=Puzzle)
        post_save.connect(add_twitter_on_schedule_created, sender=Schedule)
