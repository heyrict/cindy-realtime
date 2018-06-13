'''isort:skip_file'''
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")

import django
django.setup()

from django.utils import timezone
from django.db.models import Count, Sum, Max
from datetime import timedelta
from sui_hei.models import Puzzle, Award, UserAward
from sui_hei.signals import add_twitter_on_best_of_month_determined

best_of_month = (
    (1, Award.objects.get_or_create(name="★鶴")[0]),
    (2, Award.objects.get_or_create(name="★鶯")[0]),
    (3, Award.objects.get_or_create(name="★燕")[0]),
    (4, Award.objects.get_or_create(name="★蝶")[0]),
    (5, Award.objects.get_or_create(name="★鰹")[0]),
    (6, Award.objects.get_or_create(name="★蝸牛")[0]),
    (7, Award.objects.get_or_create(name="★蝉")[0]),
    (8, Award.objects.get_or_create(name="★鈴虫")[0]),
    (9, Award.objects.get_or_create(name="★蜻蛉")[0]),
    (10, Award.objects.get_or_create(name="★啄木鳥")[0]),
    (11, Award.objects.get_or_create(name="★鷹")[0]),
    (12, Award.objects.get_or_create(name="★狼")[0]),
)


def argmax(values):
    return max(enumerate(values), key=lambda x: x[1])[0]


def grant_best_of_month():
    last_month = timezone.now() - timedelta(days=30)

    # get the best soup of the last month
    best_soups = Puzzle.objects.filter(
        created__month=last_month.month,
        created__year=last_month.year).annotate(
            Count("star"), star__sum=Sum("star__value")).order_by(
                "-star__count", "-star__sum")

    award_of_last_month = dict(best_of_month)[last_month.month]

    # if no soup found, return
    if len(best_soups) == 0:
        return

    # grant award
    best_soup = best_soups.first()

    ua, status = UserAward.objects.get_or_create(
        user=best_soup.user, award=award_of_last_month)
    if status:
        ua.created = timezone.now()
        ua.save()

    add_twitter_on_best_of_month_determined(best_soups[:5], ua)


if __name__ == "__main__":
    grant_best_of_month()
