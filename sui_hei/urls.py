from django.conf import settings
from django.conf.urls import include
#from django.conf.urls.i18n import i18n_patterns
from django.urls import path, re_path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import RedirectView, TemplateView
from graphene_django.views import GraphQLView

from . import views

app_name = "sui_hei"

contentpatterns = [
    re_path("^(en|ja)", views.remove_i18n_pattern),
    path("event/<int:eventId>", views.event, name="event"),
    re_path("(puzzle|profile|rules|dashboard|wiki)", views.main, name="main"),
    path("", views.main, name="main"),
] # yapf: disable

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    path('favicon.ico', RedirectView.as_view(url='/static/favicon.ico', permanent=True)),
    path('sw.js', TemplateView.as_view(template_name="sw.js", content_type="application/javascript"), name="sw.js"),
    path('robots.txt', TemplateView.as_view(template_name="robots.txt", content_type="text/plain"), name="robots.txt"),
    path('users', include('django.contrib.auth.urls')),
] # yapf: disable

# GraphQL
if settings.DEBUG:
    urlpatterns.append(
        path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True))))
else:
    urlpatterns.append(path("graphql", GraphQLView.as_view(batch=True)))
