from datetime import timedelta
from django.utils import timezone

import numpy as np

from sui_hei.models import *


def calc_exp(soup, goodq, trueq, cmnt):
    return int(soup + goodq * 0.2 + trueq * 0.5 + cmnt)


def softmax(X):
    return np.exp(X) / np.sum(np.exp(X), axis=0)


def calc_score(stars):
    if stars.count() < 1: return 0
    userexp = np.array([s.user_id.experience for s in stars.all()])
    userstar = np.array(stars.values_list('value', flat=True))
    userw = softmax(userexp / userexp.mean())
    return userw.dot(userstar)


def update_user_exp(recent=None):
    if recent:
        users = User.objects.filter(
            last_login__gt=timezone.now() - recent).all()
    else:
        users = User.objects.all()
    for user in users:
        _put_ques = user.shitumon_set
        put_soups = user.mondai_set.count()
        put_goodques = _put_ques.filter(good=True).count()
        put_trueques = _put_ques.filter(true=True).count()
        put_comments = Comment.objects.filter(user_id=user).count()
        user.experience = calc_exp(put_soups, put_goodques, put_trueques,
                                   put_comments)
        print("Update: %s exp->%.2f" % (user.nickname, user.experience))

        # TODO: grant awards to users depend on experience here.
        user.save()


def update_all_soup_score():
    soups = Mondai.objects.all()

    for soup in soups:
        update_soup_score(soup)


def update_soup_score(soup, save=True):
    score = calc_score(soup.star_set)
    soup.score = 0 if np.isnan(score) else score
    soup.save()
