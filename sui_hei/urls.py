from django.conf.urls import include
from django.conf.urls.i18n import i18n_patterns
from django.urls import path, re_path
from django.views.generic import RedirectView, TemplateView
from graphene_django.views import GraphQLView

from . import views

app_name = "sui_hei"

contentpatterns = i18n_patterns(
    re_path("(puzzle|profile|rules)", views.main, name="main"),
    path("", views.main, name="main"),
) # yapf: disable

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    path('favicon.ico', RedirectView.as_view(url='/static/favicon.ico', permanent=True)),
    path('sw.js', TemplateView.as_view(template_name="sw.js", content_type="application/javascript"), name="sw.js"),
    path('users', include('django.contrib.auth.urls')),
    # GraphQL
    path("graphql", GraphQLView.as_view(batch=True)),
    #path("graphql", GraphQLView.as_view(graphiql=True)),
] # yapf: disable
