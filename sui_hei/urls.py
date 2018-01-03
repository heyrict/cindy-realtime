from django.conf.urls import include
from django.contrib.auth import views as auth_views
from django.db.models import Count, Sum
from django.urls import path, re_path
from django.views.generic import TemplateView
from graphene_django.views import GraphQLView

from . import views
from .admin import *

app_name = "sui_hei"


# yapf: disable
urlpatterns = [
    path('i18n', include('django.conf.urls.i18n')),
    path('sw.js', TemplateView.as_view(template_name="sw.js", content_type="application/javascript"), name="sw.js"),
    path('users', include('django.contrib.auth.urls')),
    # GraphQL
    path("graphql", GraphQLView.as_view(graphiql=True)),
    # rest
    #re_path("^(puzzle|profile)", views.simple, name="simple"),
    path("", views.main, name="main"),
]
# yapf: enable
