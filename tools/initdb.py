from sui_hei.models import *

print("Creating ChatRoom: lobby")
ChatRoom.objects.create(
    name="lobby",
    description="Description for lobby chat",
    user=User.objects.first())
