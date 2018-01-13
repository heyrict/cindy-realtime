from channels.routing import route, route_class

from .consumers import ws_connect, ws_disconnect, ws_message

channel_routing = [
    route("websocket.connect", ws_connect, path="/ws/"),
    route("websocket.receive", ws_message, path="/ws/"),
    route("websocket.disconnect", ws_disconnect, path="/ws/"),
]
