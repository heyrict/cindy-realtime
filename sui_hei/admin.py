from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import (PasswordChangeForm, PasswordResetForm,
                                       ReadOnlyPasswordHashField,
                                       UserChangeForm, UserCreationForm)
from django.contrib.auth.models import Group
from django.utils.translation import ugettext_lazy as _
from modeltranslation.admin import TranslationAdmin

from .models import *


# Register your models here.
class SuiheiUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('nickname', )


class SuiheiUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm):
        model = User
        fields = UserCreationForm.Meta.fields + (
            'nickname',
            'profile',
            'current_award',
        )

    def __init__(self, *args, **kwargs):
        super(SuiheiUserChangeForm, self).__init__(*args, **kwargs)
        self.fields['profile'].required = False
        self.fields['current_award'].required = False


class SuiheiPasswordChangeForm(PasswordChangeForm):
    class Meta(PasswordChangeForm):
        model = User


class SuiheiUserAdmin(UserAdmin):
    form = SuiheiUserChangeForm
    add_form = SuiheiUserCreationForm
    change_password_form = SuiheiPasswordChangeForm
    change_user_password_template = "registration/users_password_change.html"
    list_display = ('nickname', 'username', 'is_active', 'is_staff',
                    'is_superuser')
    search_fields = ('nickname', 'email')
    fieldsets = UserAdmin.fieldsets + ((None, {
        'fields': (
            'nickname',
            'profile',
            'current_award',
        )
    }), )


class SuiheiAwardAdmin(TranslationAdmin):
    pass


class SuiheiPuzzleChangeForm(forms.ModelForm):
    class Meta(forms.ModelForm):
        model = Puzzle
        exclude = tuple()

    def __init__(self, *args, **kwargs):
        super(SuiheiPuzzleChangeForm, self).__init__(*args, **kwargs)
        self.fields['memo'].required = False


class SuiheiPuzzleAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'created', 'modified')
    form = SuiheiPuzzleChangeForm


class SuiheiChatRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created')


class SuiheiChatMessageAdmin(admin.ModelAdmin):
    list_display = ('chatroom', 'user', 'content')


class SuiheiDialogueAdmin(admin.ModelAdmin):
    list_display = ('id', 'puzzle', 'user', 'question', 'answer')


class SuiheiUserAwardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'award')


class SuiheiCommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'user', 'puzzle', 'spoiler')


admin.site.register(User, SuiheiUserAdmin)
admin.site.register(Puzzle, SuiheiPuzzleAdmin)
admin.site.register(ChatMessage, SuiheiChatMessageAdmin)
admin.site.register(ChatRoom, SuiheiChatRoomAdmin)
admin.site.register(Dialogue, SuiheiDialogueAdmin)
admin.site.register(Award, SuiheiAwardAdmin)
admin.site.register(AwardApplication)
admin.site.register(UserAward, SuiheiUserAwardAdmin)
admin.site.register(Hint)
admin.site.register(Star)
admin.site.register(Bookmark)
admin.site.register(Comment, SuiheiCommentAdmin)
admin.site.register(DirectMessage)
