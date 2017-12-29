from channels.handler import AsgiHandler
from channels import Group, Channel
from channels.generic.websockets import JsonWebsocketConsumer, WebsocketDemultiplexer


class MondaiListUpdater(JsonWebsocketConsumer):

    strict_ordering = False
    http_user_and_session = True

    def connection_groups(self, **kwargs):
        return ["MondaiList"]

    def receive(self, content, multiplexer, **kwrags):
        print("MondaiList-received:", content)

    def new_mondai(self, message, **kwargs):
        pass

    def update_mondai(self, message, **kwargs):
        pass


class Demultiplexer(WebsocketDemultiplexer):
    '''
    Demultiplexer. Accepts { stream : mondai, payload: content }
    '''
    consumers = {
        "mondai": MondaiListUpdater,
    }
