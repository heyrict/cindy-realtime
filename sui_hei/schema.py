import graphene
from django.db.models import Count, Q
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import login, logout, authenticate
from graphene import relay, resolve_only_args
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from .models import *


# {{{1 Nodes
# {{{2 UserNode
class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = ["username", "nickname"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 AwardNode
class AwardNode(DjangoObjectType):
    class Meta:
        model = Award
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 UserAwardNode
class UserAwardNode(DjangoObjectType):
    class Meta:
        model = UserAward
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 MondaiNode
class MondaiNode(DjangoObjectType):
    class Meta:
        model = Mondai
        filter_fields = {
            "status": ["exact", "gt"],
        }
        interfaces = (relay.Node, )

    rowid = graphene.Int()
    quesCount = graphene.Int()
    uaquesCount = graphene.Int()

    def resolve_rowid(self, info):
        return self.id

    def resolve_quesCount(self, info):
        return Shitumon.objects.filter(mondai=self).count()

    def resolve_uaquesCount(self, info):
        return Shitumon.objects.filter(
            Q(mondai=self) & (Q(kaitou__isnull=True)
                              | Q(kaitou__exact=""))).count()


# {{{2 ShitumonNode
class ShitumonNode(DjangoObjectType):
    class Meta:
        model = Shitumon
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 LobbyNode
class LobbyNode(DjangoObjectType):
    class Meta:
        model = Lobby
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 CommentNode
class CommentNode(DjangoObjectType):
    class Meta:
        model = Comment
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 StarNode
class StarNode(DjangoObjectType):
    class Meta:
        model = Star
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{1 Mutations
# {{{2 CreateMondai
class CreateMondai(relay.ClientIDMutation):
    class Input:
        mondaiTitle = graphene.String(required=True)
        mondaiGenre = graphene.Int(required=True)
        mondaiYami = graphene.Boolean(required=True)
        mondaiContent = graphene.String(required=True)
        mondaiKaisetu = graphene.String(required=True)

    mondai = graphene.Field(MondaiNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        title = input["mondaiTitle"]
        genre = input["mondaiGenre"]
        yami = input["mondaiYami"]
        content = input["mondaiContent"]
        kaisetu = input["mondaiKaisetu"]

        created = timezone.now()

        mondai = Mondai.objects.create(
            user=user,
            title=title,
            genre=genre,
            yami=yami,
            content=content,
            kaisetu=kaisetu,
            created=created,
            modified=created)
        mondai.save()

        return CreateMondai(mondai=mondai)

# {{{2 Login
class UserLogin(relay.ClientIDMutation):
    class Input:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        request = info.context
        username = input["username"]
        password = input["password"]

        user = authenticate(request, username=username, password=password)
        if user is None:
            raise ValidationError(_("Login incorrect!"))

        login(request, user)
        return UserLogin(user=user)

# {{{2 Logout
class UserLogout(relay.ClientIDMutation):
    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        request = info.context
        logout(request)
        return UserLogout()

# {{{1 Query
class Query(object):
    # {{{2 definitions
    all_users = DjangoFilterConnectionField(
        UserNode, orderBy=graphene.List(of_type=graphene.String))
    all_awards = DjangoFilterConnectionField(
        AwardNode, orderBy=graphene.List(of_type=graphene.String))
    all_userawards = DjangoFilterConnectionField(
        UserAwardNode, orderBy=graphene.List(of_type=graphene.String))
    all_mondais = DjangoFilterConnectionField(
        MondaiNode, orderBy=graphene.List(of_type=graphene.String))
    all_shitumons = DjangoFilterConnectionField(
        ShitumonNode, orderBy=graphene.List(of_type=graphene.String))
    all_lobbys = DjangoFilterConnectionField(
        LobbyNode, orderBy=graphene.List(of_type=graphene.String))
    all_comments = DjangoFilterConnectionField(
        CommentNode, orderBy=graphene.List(of_type=graphene.String))
    all_stars = DjangoFilterConnectionField(
        StarNode, orderBy=graphene.List(of_type=graphene.String))

    user = relay.Node.Field(UserNode, id=graphene.Int())
    award = relay.Node.Field(AwardNode, id=graphene.Int())
    useraward = relay.Node.Field(UserAwardNode, id=graphene.Int())
    mondai = relay.Node.Field(MondaiNode, id=graphene.Int())
    shitumon = relay.Node.Field(ShitumonNode, id=graphene.Int())
    lobby = relay.Node.Field(LobbyNode, id=graphene.Int())
    comment = relay.Node.Field(CommentNode, id=graphene.Int())
    star = relay.Node.Field(StarNode, id=graphene.Int())

    # {{{2 resolves
    # {{{3 resolve all
    def resolve_all_users(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return User.objects.order_by(*orderBy)
        else:
            return User.objects.all()

    def resolve_all_awards(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Award.objects.order_by(*orderBy)
        else:
            return Award.objects.all()

    def resolve_all_userawards(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return UserAward.objects.order_by(*orderBy)
        else:
            return UserAward.objects.all()

    def resolve_all_mondais(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Mondai.objects.order_by(*orderBy)
        else:
            return Mondai.objects.all()

    def resolve_all_shitumons(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Lobby.objects.order_by(*orderBy)
        else:
            return Lobby.objects.all()

    def resolve_all_lobbys(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Lobby.objects.order_by(*orderBy)
        else:
            return Lobby.objects.all()

    def resolve_all_comments(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Comment.objects.order_by(*orderBy)
        else:
            return Comment.objects.all()

    def resolve_all_stars(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Star.objects.order_by(*orderBy)
        else:
            return Star.objects.all()

    # {{{3 resolve single
    def resolve_user(self, info, **kwargs):
        user_id = kwargs.get("id")
        if user_id is not None:
            return User.objects.get(pk=user_id)
        return None

    def resolve_award(self, info, **kwargs):
        award_id = kwargs.get("id")
        if award_id is not None:
            return Award.objects.get(pk=award_id)
        return None

    def resolve_useraward(self, info, **kwargs):
        useraward_id = kwargs.get("id")
        if useraward_id is not None:
            return UserAward.objects.get(pk=useraward_id)
        return None

    def resolve_mondai(self, info, **kwargs):
        mondai_id = kwargs.get("id")
        if mondai_id is not None:
            return Mondai.objects.get(pk=mondai_id)
        return None

    def resolve_shitumon(self, info, **kwargs):
        shitumon_id = kwargs.get("id")
        if shitumon_id is not None:
            return Lobby.objects.get(pk=shitumon_id)
        return None

    def resolve_lobby(self, info, **kwargs):
        lobby_id = kwargs.get("id")
        if lobby_id is not None:
            return Lobby.objects.get(pk=lobby_id)
        return None

    def resolve_comment(self, info, **kwargs):
        comment_id = kwargs.get("id")
        if comment_id is not None:
            return Comment.objects.get(pk=comment_id)
        return None

    def resolve_star(self, info, **kwargs):
        star_id = kwargs.get("id")
        if star_id is not None:
            return Star.objects.get(pk=star_id)
        return None
# {{{1 Mutation
class Mutation(graphene.ObjectType):
    create_mondai = CreateMondai.Field()
    login = UserLogin.Field()
    logout = UserLogout.Field()
