import re

from django.contrib.auth.models import (AbstractBaseUser, AbstractUser,
                                        BaseUserManager)
from django.db import connections, models
from django.db.models import Q, DO_NOTHING, SET_NULL, CASCADE
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone


# Create your models here.
class Award(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.TextField(default="")

    class Meta:
        verbose_name = _("Award")

    def __str__(self):
        return self.name


class User(AbstractUser):
    nickname = models.CharField(
        _('nick_name'), max_length=255, null=False, unique=True)
    profile = models.TextField(_('profile'), default="")
    current_award = models.ForeignKey("UserAward", null=True, on_delete=SET_NULL, related_name="current_award")
    experience = models.IntegerField(_('experience'), default=0)
    snipe = models.IntegerField(_('snipe'), default=0)
    sniped = models.IntegerField(_('sniped'), default=0)
    online = models.BooleanField(_('online'), default=False)

    REQUIRED_FIELDS = ['nickname']

    def get_full_name(self):
        return self.nickname

    def get_short_name(self):
        return self.nickname

    def __str__(self):
        return self.nickname


class UserAward(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    award = models.ForeignKey(Award, on_delete=CASCADE)
    created = models.DateField(_("created"), null=False, default=timezone.now)

    class Meta:
        verbose_name = _("User-Award")

    def __str__(self):
        return "[%s] owns [%s]" % (self.user.nickname, self.award)


class Puzzle(models.Model):
    '''
    genre:
      0: umigame
      1: tobira
      2: kameo
      3: shin-keshiki
    '''
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    title = models.CharField(_('title'), max_length=255, null=False)
    yami = models.BooleanField(_('yami'), default=False, null=False)
    genre = models.IntegerField(_('genre'), default=0, null=False)
    content = models.TextField(_('content'), null=False)
    solution = models.TextField(_('solution'), null=False)
    created = models.DateTimeField(_('created'), null=False)
    modified = models.DateTimeField(_('modified'), null=False)
    status = models.IntegerField(_('status'), default=0, null=False)
    memo = models.TextField(_('memo'), default="")
    score = models.FloatField(_('score'), default=0, null=False)

    class Meta:
        verbose_name = _("Puzzle")

    def __str__(self):
        return self.title


puzzle_genre_enum = {
    0: _("Albatross"),
    1: _("20th-Door"),
    2: _("Little Albat"),
    3: _("Others & Formal")
}

puzzle_status_enum = {
    0: _("Unsolved"),
    1: _("Solved"),
    2: _("Dazed"),
    3: _("Hidden"),
    4: _("Forced Hidden")
}


class Dialogue(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    question = models.TextField(_('question'), null=False)
    answer = models.TextField(_('answer'), null=True)
    good = models.BooleanField(_('good_ques'), default=False, null=False)
    true = models.BooleanField(_('true_ques'), default=False, null=False)
    created = models.DateTimeField(_('created'), null=False)
    answeredtime = models.DateTimeField(_('answeredtime'), null=True)

    class Meta:
        verbose_name = _("Question")

    def __str__(self):
        return "[%s]%s: {%s} puts {%50s}" % (self.puzzle.id, self.puzzle,
                                             self.user, self.question)


class Hint(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    content = models.TextField(_('content'), null=False)
    created = models.DateTimeField(_('created'), null=False, default=timezone.now)


class Minichat(models.Model):
    id = models.AutoField(max_length=11, null=False, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    channel = models.TextField(_('channel'), default="lobby", null=False)
    content = models.TextField(_('content'), null=False)

    #score = models.SmallIntegerField(_('score'), default=50)

    class Meta:
        permissions = (
            ("can_add_info", _("Can add homepage info")),
            ("can_grant_award", _("Can grant awards to users")), )
        verbose_name = _("Minichat")

    def __str__(self):
        return "[%s]: {%s} puts {%50s}" % (self.channel, self.user,
                                           self.content)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    content = models.TextField(_('content'), null=False)
    spoiler = models.BooleanField(_('spoiler'), default=False)

    class Meta:
        verbose_name = _("Comment")

    def __str__(self):
        return "{%s} commented on {%s}" % (self.user, self.puzzle.title)


class Star(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    value = models.FloatField(_('Value'), null=False, default=0)

    class Meta:
        verbose_name = _("Star")

    def __str__(self):
        return "%s -- %.1f --> %s" % (self.user, self.value, self.puzzle)
