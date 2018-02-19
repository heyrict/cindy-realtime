from channels.routing import route, route_class

from .consumers import *

channel_routing = [
    route("websocket.connect", sub_connect, path="/ws/"),
    route("websocket.receive", sub_message, path="/ws/"),
    route("websocket.disconnect", sub_disconnect, path="/ws/"),
    route("websocket.connect", ws_connect, path="/direct/"),
    route("websocket.receive", ws_message, path="/direct/"),
    route("websocket.disconnect", ws_disconnect, path="/direct/"),
    route("django.model_changed", model_changed),
    route("graphql.subscription", graphql_subscription),
]
