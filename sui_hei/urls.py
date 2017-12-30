from django.conf.urls import include
from django.contrib.auth import views as auth_views
from django.db.models import Count, Sum
from django.urls import path, re_path
from graphene_django.views import GraphQLView

from . import views
from .admin import *

app_name = "sui_hei"


# yapf: disable
urlpatterns = [
    path('i18n', include('django.conf.urls.i18n')),
    path('users', include('django.contrib.auth.urls')),
    # GraphQL
    path("graphql", GraphQLView.as_view(graphiql=True)),
    # rest
    re_path("^(mondai|profile|test)", views.simple, name="simple"),
    path("", views.simple, name="index"),
]
# yapf: enable
