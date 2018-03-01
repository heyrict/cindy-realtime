from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url

from sui_hei.consumers import GraphqlSubcriptionConsumer, MainConsumer

application = ProtocolTypeRouter({
    "websocket":
    AuthMiddlewareStack(
        URLRouter([
            url("^ws/$", GraphqlSubcriptionConsumer),
            url("^direct/$", MainConsumer),
        ])),
})
