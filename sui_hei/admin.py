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
            'current_award', )

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
            'current_award', )
    }), )


class SuiheiAwardAdmin(TranslationAdmin):
    pass


class SuiheiMondaiChangeForm(forms.ModelForm):
    class Meta(forms.ModelForm):
        model = Mondai
        exclude = tuple()

    def __init__(self, *args, **kwargs):
        super(SuiheiMondaiChangeForm, self).__init__(*args, **kwargs)
        self.fields['memo'].required = False


class SuiheiMondaiAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'created', 'modified',
                    'score')
    form = SuiheiMondaiChangeForm


class SuiheiLobbyAdmin(admin.ModelAdmin):
    list_display = ('channel', 'user', 'content')
    search_fields = ('channel', )


class SuiheiShitumonAdmin(admin.ModelAdmin):
    list_display = ('id', 'mondai', 'user', 'shitumon', 'kaitou')


class SuiheiUserAwardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'award')


class SuiheiCommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'user', 'mondai', 'spoiler')


admin.site.register(User, SuiheiUserAdmin)
admin.site.register(Mondai, SuiheiMondaiAdmin)
admin.site.register(Shitumon, SuiheiShitumonAdmin)
admin.site.register(Lobby, SuiheiLobbyAdmin)
admin.site.register(Award, SuiheiAwardAdmin)
admin.site.register(UserAward, SuiheiUserAwardAdmin)
admin.site.register(Star)
admin.site.register(Comment, SuiheiCommentAdmin)
