import re

from django.contrib.auth.models import (AbstractBaseUser, AbstractUser,
                                        BaseUserManager)
from django.db import connections, models
from django.db.models import CASCADE, DO_NOTHING, SET_NULL, Q
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _


class UserManager(BaseUserManager):
    def create_user(self,
                    username,
                    nickname,
                    password=None,
                    is_admin=False,
                    is_staff=False,
                    is_active=True):
        if not username:
            raise ValueError(_("User must have a username"))
        if not nickname:
            raise ValueError(_("User must have a nickname"))

        user = self.model()
        user.username = username
        user.set_password(password)
        user.nickname = nickname
        user.is_admin = is_admin
        user.is_staff = is_staff
        user.is_active = is_active
        user.save()
        return user

    def create_superuser(self, nickname, username, password=None):
        user = self.create_user(
            nickname=nickname,
            username=username,
            password=password,
            is_staff=True,
            is_admin=True,
        )
        return user


# Create your models here.
class Award(models.Model):
    name = models.CharField(max_length=255)
    groupName = models.CharField(max_length=255, default="default")
    description = models.TextField(default="")
    requisition = models.TextField(default="")

    class Meta:
        verbose_name = _("Award")

    def __str__(self):
        return self.name


class AwardApplication(models.Model):
    award = models.ForeignKey(Award, on_delete=CASCADE)
    applier = models.ForeignKey(
        "User", related_name="applier", on_delete=CASCADE)
    status = models.IntegerField(_("status"), default=0)
    comment = models.TextField(_("comment"), blank=True)
    reviewer = models.ForeignKey(
        "User", related_name="reviewer", on_delete=CASCADE, null=True)
    reason = models.TextField(_("reason"), blank=True)
    created = models.DateTimeField(_("created"), default=timezone.now)
    reviewed = models.DateTimeField(_("reviewed"), null=True)

    class Meta:
        verbose_name = _("Award Application")
        permissions = [("can_review_award_application", _("Can review award application")), ] # yapf: disable

    def __str__(self):
        return "[%s]: %s" % (str(self.applier), str(self.award))


awardapplication_status_enum = {
    0: _("Waiting"),
    1: _("Accepted"),
    2: _("Denied"),
}


class User(AbstractUser):
    nickname = models.CharField(_('nick_name'), max_length=255, unique=True)
    profile = models.TextField(_('profile'), default="")
    current_award = models.ForeignKey(
        "UserAward",
        null=True,
        on_delete=SET_NULL,
        related_name="current_award")
    credit = models.IntegerField(_('credit'), default=0)
    hide_bookmark = models.BooleanField(_('hide bookmark'), default=True)
    last_read_dm = models.ForeignKey(
        'DirectMessage',
        null=True,
        on_delete=SET_NULL,
        related_name="last_read_dm")

    REQUIRED_FIELDS = ['nickname']
    objects = UserManager()

    class Meta:
        permissions = [("can_send_global_notification", _("Can send global notification")),] # yapf: disable

    def get_full_name(self):
        return self.nickname

    def get_short_name(self):
        return self.nickname

    def __str__(self):
        return self.nickname


class UserAward(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    award = models.ForeignKey(Award, on_delete=CASCADE)
    created = models.DateField(_("created"), default=timezone.now)

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
    id = models.AutoField(max_length=11, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    title = models.CharField(_('title'), max_length=255)
    yami = models.IntegerField(_('yami'), default=0)
    genre = models.IntegerField(_('genre'), default=0)
    content = models.TextField(_('content'))
    solution = models.TextField(_('solution'))
    content_safe = models.BooleanField(
        _('allow safe rendering'), default=False)
    created = models.DateTimeField(_('created'))
    modified = models.DateTimeField(_('modified'))
    status = models.IntegerField(_('status'), default=0)
    memo = models.TextField(_('memo'), blank=True)
    anonymous = models.BooleanField(_('anonymous'), default=False)

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

puzzle_yami_enum = {0: _("Normal"), 1: _("Yami"), 2: _("Long-term Yami")}


class Dialogue(models.Model):
    id = models.AutoField(max_length=11, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    question = models.TextField(_('question'))
    questionEditTimes = models.IntegerField(
        _("question edit times"), default=0)
    answer = models.TextField(_('answer'), blank=True)
    answerEditTimes = models.IntegerField(_("answer edit times"), default=0)
    good = models.BooleanField(_('good_ques'), default=False)
    true = models.BooleanField(_('true_ques'), default=False)
    created = models.DateTimeField(_('created'))
    answeredtime = models.DateTimeField(_('answeredtime'), null=True)

    class Meta:
        verbose_name = _("Question")

    def __str__(self):
        return "[%s]%s: {%s} puts {%s}" % (self.puzzle.id, self.puzzle,
                                           self.user, str(self.question)[:50])


class Hint(models.Model):
    id = models.AutoField(max_length=11, primary_key=True)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    content = models.TextField(_('content'))
    created = models.DateTimeField(_('created'), default=timezone.now)

    class Meta:
        verbose_name = _("Hint")

    def __str__(self):
        return "[%s]: %s" % (self.puzzle, str(self.content)[:50])


class ChatMessage(models.Model):
    id = models.AutoField(max_length=11, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    chatroom = models.ForeignKey('ChatRoom', on_delete=CASCADE)
    content = models.TextField(_('content'))
    created = models.DateTimeField(
        _("created"), null=True, default=timezone.now)
    editTimes = models.IntegerField(_("edit times"), default=0)

    class Meta:
        verbose_name = _("ChatMessage")

    def __str__(self):
        return "[%s]: {%s} puts {%50s}" % (self.chatroom, self.user,
                                           self.content)


class DirectMessage(models.Model):
    id = models.AutoField(max_length=11, primary_key=True)
    sender = models.ForeignKey(User, related_name="sender", on_delete=CASCADE)
    receiver = models.ForeignKey(
        User, related_name="receiver", on_delete=CASCADE)
    content = models.TextField(_('content'))
    created = models.DateTimeField(_("created"), default=timezone.now)

    class Meta:
        verbose_name = _("DirectMessage")

    def __str__(self):
        return "[%s] sends a DM to [%s]" % (self.sender, self.receiver)


class ChatRoom(models.Model):
    id = models.AutoField(max_length=11, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    name = models.CharField(_('channel'), max_length=255, unique=True)
    description = models.TextField(_('description'))
    private = models.BooleanField(_('private'), default=True)
    created = models.DateField(_("created"), default=timezone.now)

    class Meta:
        verbose_name = _("ChatRoom")

    def __str__(self):
        return self.name


class FavoriteChatRoom(models.Model):
    id = models.AutoField(max_length=11, primary_key=True)
    user = models.ForeignKey(User, on_delete=CASCADE)
    chatroom = models.ForeignKey(ChatRoom, on_delete=CASCADE)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    content = models.TextField(_('content'))
    spoiler = models.BooleanField(_('spoiler'), default=False)

    class Meta:
        verbose_name = _("Comment")

    def __str__(self):
        return "{%s} commented on {%s}" % (self.user, self.puzzle.title)


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    value = models.FloatField(_('Value'), default=0)

    class Meta:
        verbose_name = _("Bookmark")

    def __str__(self):
        return "%s -- %.1f --> %s" % (self.user, self.value, self.puzzle)


class Star(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=CASCADE)
    value = models.FloatField(_('Value'), default=0)

    class Meta:
        verbose_name = _("Star")

    def __str__(self):
        return "%s -- %.1f --> %s" % (self.user, self.value, self.puzzle)


class Schedule(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE)
    content = models.TextField(_("content"))
    created = models.DateTimeField(_("created"), default=timezone.now)
    scheduled = models.DateTimeField(_("reviewed"))

    class Meta:
        verbose_name = _("Schedule")

    def __str__(self):
        return "[%s TO %s]: (%s) %s" % (self.scheduled, self.created,
                                        self.user, str(self.content)[:50])
