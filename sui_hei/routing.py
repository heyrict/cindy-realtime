from channels.routing import route, route_class
from .consumers import Demultiplexer

channel_routing = [
    Demultiplexer.as_route(path="/"),
]
