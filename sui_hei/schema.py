from itertools import chain

import graphene
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.db.models import Q, Count
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from graphene import relay, resolve_only_args
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql_relay import from_global_id

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


# {{{2 PuzzleNode
class PuzzleNode(DjangoObjectType):
    class Meta:
        model = Puzzle
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
        return Dialogue.objects.filter(puzzle=self).count()

    def resolve_uaquesCount(self, info):
        return Dialogue.objects.filter(
            Q(puzzle=self) & (Q(answer__isnull=True)
                              | Q(answer__exact=""))).count()


# {{{2 DialogueNode
class DialogueNode(DjangoObjectType):
    class Meta:
        model = Dialogue
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 HintNode
class HintNode(DjangoObjectType):
    class Meta:
        model = Hint
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 MinichatNode
class MinichatNode(DjangoObjectType):
    class Meta:
        model = Minichat
        filter_fields = ['channel']
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


# {{{1 Unions
# {{{2 PuzzleShowUnion
class PuzzleShowUnion(graphene.Union):
    class Meta:
        types = (DialogueNode, HintNode)


class PuzzleShowUnionConnection(relay.Connection):
    class Meta:
        node = PuzzleShowUnion


# {{{1 Mutations
# {{{2 CreatePuzzle
class CreatePuzzle(relay.ClientIDMutation):
    puzzle = graphene.Field(PuzzleNode)

    class Input:
        puzzleTitle = graphene.String(required=True)
        puzzleGenre = graphene.Int(required=True)
        puzzleYami = graphene.Boolean(required=True)
        puzzleContent = graphene.String(required=True)
        puzzleSolution = graphene.String(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        title = input["puzzleTitle"]
        genre = input["puzzleGenre"]
        yami = input["puzzleYami"]
        content = input["puzzleContent"]
        solution = input["puzzleSolution"]

        if not title:
            raise ValidationError("Title cannot be empty!")
        if not content:
            raise ValidationError("Content cannot be empty!")
        if not solution:
            raise ValidationError("Solution cannot be empty!")

        created = timezone.now()

        puzzle = Puzzle.objects.create(
            user=user,
            title=title,
            genre=genre,
            yami=yami,
            content=content,
            solution=solution,
            created=created,
            modified=created)

        return CreatePuzzle(puzzle=puzzle)


# {{{2 CreateQuestion
class CreateQuestion(graphene.ClientIDMutation):
    dialogue = graphene.Field(DialogueNode)

    class Input:
        content = graphene.String()
        puzzleId = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        content = input['content']
        puzzleId = input['puzzleId']

        if not content:
            raise ValidationError(_("Question content cannot be empty!"))

        puzzle = Puzzle.objects.get(id=puzzleId)
        created = timezone.now()

        dialogue = Dialogue.objects.create(
            user=user, puzzle=puzzle, question=content, created=created)

        return CreateQuestion(dialogue=dialogue)


# {{{2 CreateHint
class CreateHint(graphene.ClientIDMutation):
    hint = graphene.Field(HintNode)

    class Input:
        content = graphene.String()
        puzzleId = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        content = input['content']
        puzzleId = input['puzzleId']

        if not content:
            raise ValidationError(_("Hint content cannot be empty!"))

        puzzle = Puzzle.objects.get(id=puzzleId)
        created = timezone.now()

        if puzzle.user != user:
            raise ValidationError(_("You are not the creator of this puzzle"))

        hint = Hint.objects.create(
            puzzle=puzzle, content=content, created=created)

        return CreateHint(hint=hint)


# {{{2 CreateMinichat
class CreateMinichat(graphene.ClientIDMutation):
    minichat = graphene.Field(MinichatNode)

    class Input:
        content = graphene.String()
        channel = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        content = input['content']
        channel = input['channel']

        if not content:
            raise ValidationError(_("Minichat content cannot be empty!"))

        minichat = Minichat.objects.create(
            content=content, user=user, channel=channel)

        return CreateMinichat(minichat=minichat)


# {{{2 UpdateAnswer
class UpdateAnswer(graphene.ClientIDMutation):
    dialogue = graphene.Field(DialogueNode)

    class Input:
        dialogueId = graphene.Int()
        content = graphene.String()
        good = graphene.Boolean()
        true = graphene.Boolean()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        dialogueId = input['dialogueId']
        content = input['content']
        good = input['good']
        true = input['true']

        if not content:
            raise ValidationError(_("Question content cannot be empty!"))

        dialogue = Dialogue.objects.get(id=dialogueId)

        if dialogue.answer is None:
            dialogue.answeredtime = timezone.now()

        dialogue.answer = content
        dialogue.good = good
        dialogue.true = true
        dialogue.save()

        return UpdateAnswer(dialogue=dialogue)


# {{{2 UpdatePuzzle
class UpdatePuzzle(graphene.ClientIDMutation):
    puzzle = graphene.Field(PuzzleNode)

    class Input:
        puzzleId = graphene.Int()
        yami = graphene.Boolean()
        solution = graphene.String()
        memo = graphene.String()
        solve = graphene.Boolean()
        hidden = graphene.Boolean()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        puzzleId = input['puzzleId']
        yami = input.get('yami')
        solution = input.get('solution')
        memo = input.get('memo')
        solve = input.get('solve')
        hidden = input.get('hidden')

        if solution == '':
            raise ValidationError(_("Solution cannot be empty!"))

        puzzle = Puzzle.objects.get(id=puzzleId)

        if yami is not None:
            puzzle.yami = yami

        if solution:
            puzzle.solution = solution

        if memo is not None:
            puzzle.memo = memo

        if solve:
            puzzle.status = 1
            puzzle.modified = timezone.now()

        if hidden is not None and puzzle.status != 4:
            if hidden: puzzle.status = 3
            else: puzzle.status = 1

        puzzle.save()
        return UpdatePuzzle(puzzle=puzzle)


# {{{2 UpdateHint
class UpdateHint(relay.ClientIDMutation):
    hint = graphene.Field(HintNode)

    class Input:
        content = graphene.String()
        hintId = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        hintId = input['hintId']
        content = input['content']

        if not content:
            raise ValidationError(_("Hint content cannot be empty!"))

        hint = Hint.objects.get(id=hintId)

        if hint.puzzle.user != user:
            raise ValidationError(
                _("Only puzzle's creator can edit this hint"))

        hint.content = content
        hint.save()

        return UpdateHint(hint=hint)


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


# {{{2 Register
class UserRegister(relay.ClientIDMutation):
    class Input:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        nickname = graphene.String(required=True)

    user = graphene.Field(UserNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        request = info.context
        username = input[
            "username"]  # username: [a-zA-Z0-9\@+_\-.], less than 150
        password = input[
            "password"]  # password: both num and alphabet, more than 8, less than 32
        nickname = input["nickname"]  # nickname: (0, 64]

        if not re.findall(r"^[a-zA-Z0-9\@+_\-.]+$", username):
            raise ValidationError(
                "Characters other than letters,"
                "digits and @/./+/-/_ are not allowed in username")
        if len(username) > 150:
            raise ValidationError(
                "Your username is too long (more than 150 characters)")
        if not (re.findall(r"[0-9]+", password)
                and re.findall(r"[a-zA-Z]", password)):
            raise ValidationError(
                "Password should have both letters and digits")
        if len(password) < 8:
            raise ValidationError(
                "Your password is too short (less than 8 characters)")
        if len(password) > 64:
            raise ValidationError(
                "Your password is too long (more than 32 characters)")
        if len(nickname) > 64:
            raise ValidationError(
                "Your nickname is too long (more than 64 characters)")

        user = User.objects.create_user(
            username=username, nickname=nickname, password=password)

        login(request, user)
        return UserRegister(user=user)


# {{{1 Query
class Query(object):
    # {{{2 connections
    all_users = DjangoFilterConnectionField(
        UserNode, orderBy=graphene.List(of_type=graphene.String))
    all_awards = DjangoFilterConnectionField(
        AwardNode, orderBy=graphene.List(of_type=graphene.String))
    all_userawards = DjangoFilterConnectionField(
        UserAwardNode, orderBy=graphene.List(of_type=graphene.String))
    all_puzzles = DjangoFilterConnectionField(
        PuzzleNode, orderBy=graphene.List(of_type=graphene.String))
    all_dialogues = DjangoFilterConnectionField(
        DialogueNode, orderBy=graphene.List(of_type=graphene.String))
    all_minichats = DjangoFilterConnectionField(
        MinichatNode, orderBy=graphene.List(of_type=graphene.String))
    all_comments = DjangoFilterConnectionField(
        CommentNode, orderBy=graphene.List(of_type=graphene.String))
    all_stars = DjangoFilterConnectionField(
        StarNode, orderBy=graphene.List(of_type=graphene.String))

    # {{{2 nodes
    user = relay.Node.Field(UserNode)
    award = relay.Node.Field(AwardNode)
    useraward = relay.Node.Field(UserAwardNode)
    puzzle = relay.Node.Field(PuzzleNode)
    hint = relay.Node.Field(HintNode)
    dialogue = relay.Node.Field(DialogueNode)
    minichat = relay.Node.Field(MinichatNode)
    comment = relay.Node.Field(CommentNode)
    star = relay.Node.Field(StarNode)

    # {{{2 unions
    puzzle_show_union = relay.ConnectionField(
        PuzzleShowUnionConnection, id=graphene.ID(required=True))

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

    def resolve_all_puzzles(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Puzzle.objects.order_by(*orderBy)
        else:
            return Puzzle.objects.all()

    def resolve_all_dialogues(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Minichat.objects.order_by(*orderBy)
        else:
            return Minichat.objects.all()

    def resolve_all_minichats(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)

        if orderBy:
            return Minichat.objects.order_by(*orderBy)
        else:
            return Minichat.objects.all()

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

    # {{{3 resolve union
    def resolve_puzzle_show_union(self, info, **kwargs):
        _, puzzleId = from_global_id(kwargs["id"])
        puzzle = Puzzle.objects.get(id=puzzleId)
        dialogue_list = Dialogue.objects.filter(puzzle__exact=puzzle)
        hint_list = Hint.objects.filter(puzzle__exact=puzzle)
        return sorted(chain(dialogue_list, hint_list), key=lambda x: x.created)


# {{{1 Mutation
class Mutation(graphene.ObjectType):
    create_puzzle = CreatePuzzle.Field()
    create_question = CreateQuestion.Field()
    create_hint = CreateHint.Field()
    create_minichat = CreateMinichat.Field()
    update_answer = UpdateAnswer.Field()
    update_puzzle = UpdatePuzzle.Field()
    update_hint = UpdateHint.Field()
    login = UserLogin.Field()
    logout = UserLogout.Field()
    register = UserRegister.Field()
