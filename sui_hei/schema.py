from itertools import chain

import django_filters
import graphene
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.db.models import Count, F, Q, Sum
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django_filters import FilterSet
from graphene import relay, resolve_only_args
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql_relay import from_global_id

from awards import judgers

from .models import *


# {{{1 resolveOrderBy
def resolveOrderBy(instance, order_by):
    '''
    resolve order_by operation with nulls put at last.

    Parameters
    ----------
    instance: Django Model
    order_by: array of strings of default django order_by statement.
              e.g. 'field' '-field'
    '''
    if order_by:
        field = order_by[0]
        desc = (field[0] == '-')
        fieldQueries = []
        for field in order_by:
            desc = (field[0] == '-')
            fieldName = re.sub("^-", "", field)
            fieldQueries.append(
                F(fieldName).desc(nulls_last=True)
                if desc else F(fieldName).asc(nulls_last=True))
        return instance.objects.order_by(*fieldQueries)
    else:
        return instance.objects.all()


# {{{1 Nodes
# {{{2 UserNode
class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = ["username", "nickname"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()
    puzzleCount = graphene.Int()
    quesCount = graphene.Int()
    goodQuesCount = graphene.Int()
    trueQuesCount = graphene.Int()
    commentCount = graphene.Int()

    def resolve_rowid(self, info):
        return self.id

    def resolve_puzzleCount(self, info):
        return self.puzzle_set.count()

    def resolve_quesCount(self, info):
        return self.dialogue_set.count()

    def resolve_goodQuesCount(self, info):
        return self.dialogue_set.filter(good=True).count()

    def resolve_trueQuesCount(self, info):
        return self.dialogue_set.filter(true=True).count()

    def resolve_commentCount(self, info):
        return self.comment_set.count()


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
            "user": ["exact"],
        }
        interfaces = (relay.Node, )

    rowid = graphene.Int()
    quesCount = graphene.Int()
    uaquesCount = graphene.Int()
    starCount = graphene.Int()
    starSum = graphene.Int()
    commentCount = graphene.Int()
    bookmarkCount = graphene.Int()

    def resolve_rowid(self, info):
        return self.id

    def resolve_quesCount(self, info):
        return self.dialogue_set.count()

    def resolve_uaquesCount(self, info):
        return self.dialogue_set.filter(
            Q(answer__isnull=True) | Q(answer__exact="")).count()

    def resolve_starCount(self, info):
        try:
            return self.starCount
        except:
            return self.star_set.count()

    def resolve_starSum(self, info):
        try:
            return self.StarSum
        except:
            return self.star_set.aggregate(Sum("value"))

    def resolve_commentCount(self, info):
        try:
            return self.commentCount
        except:
            return self.comment_set.count()

    def resolve_bookmarkCount(self, info):
        try:
            return self.bookmarkCount
        except:
            return self.bookmark_set.count()


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


# {{{2 ChatMessageNode
class ChatMessageNode(DjangoObjectType):
    class Meta:
        model = ChatMessage
        filter_fields = ['chatroom']
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 ChatRoomNode
class ChatRoomNode(DjangoObjectType):
    class Meta:
        model = ChatRoom
        filter_fields = ['name']
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 CommentNode
class CommentNode(DjangoObjectType):
    class Meta:
        model = Comment
        filter_fields = ["user", "puzzle"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 StarNode
class StarNode(DjangoObjectType):
    class Meta:
        model = Star
        filter_fields = ["id", "user", "puzzle"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 BookmarkNode
class BookmarkNode(DjangoObjectType):
    class Meta:
        model = Bookmark
        filter_fields = ["user", "puzzle"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 FavoriteChatRoomNode
class FavoriteChatRoomNode(DjangoObjectType):
    class Meta:
        model = FavoriteChatRoom
        filter_fields = ["user"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{1 FilterSets
# {{{2 PuzzleNodeFilterSet
class PuzzleNodeFilterSet(FilterSet):
    name = django_filters.CharFilter()

    class Meta:
        model = Puzzle
        fields = {
            "status": ["exact", "gt"],
            "user": ["exact"],
        }

    @property
    def qs(self):
        return super(PuzzleNodeFilterSet, self).qs.annotate(
            starCount=Count("star__value"), starSum=Sum("star__value"))


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

        # Delete messages in puzzle-[id] channel
        crName = "puzzle-%d" % puzzle.id
        existingChatRooms = ChatRoom.objects.filter(name=crName)
        if len(existingChatRooms) != 0:
            existingChatRooms.delete()
        ChatRoom.objects.create(name=crName, user=user)

        # Judge soup count and grant awards
        judgers["soup"].execute(user)

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


# {{{2 CreateChatMessage
class CreateChatMessage(graphene.ClientIDMutation):
    chatmessage = graphene.Field(ChatMessageNode)

    class Input:
        content = graphene.String()
        chatroom = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        content = input['content']
        chatroom = ChatRoom.objects.get(
            id=from_global_id(input['chatroom'])[1])

        if not content:
            raise ValidationError(_("Chatroom content cannot be empty!"))

        chatmessage = ChatMessage.objects.create(
            content=content, user=user, chatroom=chatroom)

        return CreateChatMessage(chatmessage=chatmessage)


# {{{2 CreateBookmark
class CreateBookmark(graphene.ClientIDMutation):
    bookmark = graphene.Field(BookmarkNode)

    class Input:
        puzzleId = graphene.Int()
        value = graphene.Float()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        value = input["value"]
        puzzleId = input["puzzleId"]
        puzzle = Puzzle.objects.get(id=puzzleId)

        bookmark = Bookmark.objects.get_or_create(user=user, puzzle=puzzle)[0]
        bookmark.value = value
        bookmark.save()

        return CreateBookmark(bookmark=bookmark)


# {{{2 CreateChatRoom
class CreateChatRoom(graphene.ClientIDMutation):
    chatroom = graphene.Field(ChatRoomNode)

    class Input:
        name = graphene.String()
        description = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        name = input["name"]
        description = input["description"]
        existingChatrooms = ChatRoom.objects.filter(name=name)
        if len(existingChatrooms) > 0:
            raise ValidationError("Channel %s exists already!" % name)

        chatroom = ChatRoom.objects.create(
            user=user, name=name, description=description)

        return CreateChatRoom(chatroom=chatroom)


# {{{2 CreateFavoriteChatRoom
class CreateFavoriteChatRoom(graphene.ClientIDMutation):
    favchatroom = graphene.Field(FavoriteChatRoomNode)

    class Input:
        chatroomName = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        chatroomName = input["chatroomName"]
        chatroom = ChatRoom.objects.get(name=chatroomName)

        ind, favchatroom = FavoriteChatRoom.objects.get_or_create(
            user=user, chatroom=chatroom)

        return CreateFavoriteChatRoom(favchatroom=favchatroom)


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
        else:
            dialogue.answerEditTimes += 1

        dialogue.answer = content
        dialogue.good = good
        dialogue.true = true
        dialogue.save()

        return UpdateAnswer(dialogue=dialogue)


# {{{2 UpdateQuestion
class UpdateQuestion(graphene.ClientIDMutation):
    dialogue = graphene.Field(DialogueNode)

    class Input:
        dialogueId = graphene.Int()
        question = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        dialogueId = input['dialogueId']
        question = input['question']

        if not question:
            raise ValidationError(_("Question content cannot be empty!"))

        dialogue = Dialogue.objects.get(id=dialogueId)
        dialogue.questionEditTimes += 1

        dialogue.question = question
        dialogue.save()

        return UpdateQuestion(dialogue=dialogue)


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

        if hidden is not None and puzzle.status != 4 and puzzle.status != 0:
            if hidden: puzzle.status = 3
            else: puzzle.status = 1

        puzzle.save()
        return UpdatePuzzle(puzzle=puzzle)


# {{{2 UpdateStar
class UpdateStar(graphene.ClientIDMutation):
    star = graphene.Field(StarNode)

    class Input:
        puzzleId = graphene.Int()
        value = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        print(input)
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        value = input["value"]
        puzzleId = input["puzzleId"]
        puzzle = Puzzle.objects.get(id=puzzleId)

        star = Star.objects.get_or_create(user=user, puzzle=puzzle)[0]
        star.value = value
        star.save()

        return UpdateStar(star=star)


# {{{2 UpdateComment
class UpdateComment(graphene.ClientIDMutation):
    comment = graphene.Field(CommentNode)

    class Input:
        puzzleId = graphene.Int()
        content = graphene.String()
        spoiler = graphene.Boolean()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        content = input["content"]
        puzzleId = input["puzzleId"]
        spoiler = input["spoiler"]
        puzzle = Puzzle.objects.get(id=puzzleId)

        comment = Comment.objects.get_or_create(user=user, puzzle=puzzle)[0]
        comment.content = content
        comment.spoiler = spoiler
        comment.save()

        return UpdateComment(comment=comment)


# {{{2 UpdateBookmark
class UpdateBookmark(graphene.ClientIDMutation):
    bookmark = graphene.Field(BookmarkNode)

    class Input:
        bookmarkId = graphene.Int()
        value = graphene.Float()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        value = input["value"]
        bookmarkId = input["bookmarkId"]
        bookmark = Bookmark.objects.get(id=bookmarkId)

        if (bookmark.user.id != user.id):
            raise ValidationError(
                _("You are not the creator of this bookmark"))

        bookmark.value = value
        bookmark.save()

        return UpdateBookmark(bookmark=bookmark)


# {{{2 UpdateChatRoom
class UpdateChatRoom(graphene.ClientIDMutation):
    chatroom = graphene.Field(ChatRoomNode)

    class Input:
        chatroomId = graphene.Int()
        description = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        description = input["description"]
        chatroomId = input["chatroomId"]
        chatroom = ChatRoom.objects.get(id=chatroomId)

        if (chatroom.user.id != user.id):
            raise ValidationError(
                _("You are not the creator of this chatroom"))

        chatroom.description = description
        chatroom.save()

        return UpdateChatRoom(chatroom=chatroom)


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


# {{{2 UpdateCurrentAward
class UpdateCurrentAward(relay.ClientIDMutation):
    class Input:
        userawardId = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        userawardId = input.get('userawardId')

        if not userawardId:
            user.current_award = None
        else:
            useraward = UserAward.objects.get(id=userawardId)
            if useraward.user != user:
                raise ValidationError(_("Only award owner can set this award"))
            user.current_award = useraward

        user.save()
        return UpdateCurrentAward()


# {{{2 UpdateUser
class UpdateUser(relay.ClientIDMutation):
    user = graphene.Field(UserNode)

    class Input:
        profile = graphene.String()
        hide_bookmark = graphene.Boolean()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        profile = input.get("profile")
        hide_bookmark = input.get("hide_bookmark", None)
        if profile:
            user.profile = profile

        if hide_bookmark is not None:
            user.hide_bookmark = hide_bookmark

        if profile or hide_bookmark is not None:
            user.save()

        return UpdateUser(user=user)


# {{{2 DeleteBookmark
class DeleteBookmark(graphene.ClientIDMutation):
    class Input:
        bookmarkId = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        bookmarkId = input["bookmarkId"]
        bookmark = Bookmark.objects.get(id=bookmarkId)

        if (bookmark.user.id != user.id):
            raise ValidationError(
                _("You are not the creator of this bookmark"))

        bookmark.delete()

        return DeleteBookmark()


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
        nickname = input["nickname"].strip()  # nickname: (0, 64]

        if not re.findall(r"^[a-zA-Z0-9\@+_\-.]+$", username):
            raise ValidationError(
                "Characters other than letters,"
                "digits and @/./+/-/_ are not allowed in username")
        if len(username) < 4:
            raise ValidationError(
                "Your username is too short (less than 4 characters)")
        if len(username) > 150:
            raise ValidationError(
                "Your username is too long (more than 150 characters)")
        if re.findall("^[ 　]*$", nickname):
            raise ValidationError("Username cannot be blank!")
        if len(nickname) > 64:
            raise ValidationError(
                "Your nickname is too long (more than 64 characters)")
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
        PuzzleNode,
        filterset_class=PuzzleNodeFilterSet,
        orderBy=graphene.List(of_type=graphene.String))
    all_dialogues = DjangoFilterConnectionField(
        DialogueNode, orderBy=graphene.List(of_type=graphene.String))
    all_chatmessages = DjangoFilterConnectionField(
        ChatMessageNode, orderBy=graphene.List(of_type=graphene.String))
    all_chatrooms = DjangoFilterConnectionField(
        ChatRoomNode, orderBy=graphene.List(of_type=graphene.String))
    all_comments = DjangoFilterConnectionField(
        CommentNode, orderBy=graphene.List(of_type=graphene.String))
    all_stars = DjangoFilterConnectionField(
        StarNode, orderBy=graphene.List(of_type=graphene.String))
    all_bookmarks = DjangoFilterConnectionField(
        BookmarkNode, orderBy=graphene.List(of_type=graphene.String))

    # {{{2 nodes
    user = relay.Node.Field(UserNode)
    award = relay.Node.Field(AwardNode)
    useraward = relay.Node.Field(UserAwardNode)
    puzzle = relay.Node.Field(PuzzleNode)
    hint = relay.Node.Field(HintNode)
    dialogue = relay.Node.Field(DialogueNode)
    chatmessage = relay.Node.Field(ChatMessageNode)
    comment = relay.Node.Field(CommentNode)
    star = relay.Node.Field(StarNode)
    bookmark = relay.Node.Field(BookmarkNode)

    # {{{2 unions
    puzzle_show_union = relay.ConnectionField(
        PuzzleShowUnionConnection, id=graphene.ID(required=True))

    # {{{2 resolves
    # {{{3 resolve all
    def resolve_all_users(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(User, orderBy)

    def resolve_all_awards(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Award, orderBy)

    def resolve_all_userawards(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(UserAward, orderBy)

    def resolve_all_puzzles(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Puzzle, orderBy)

    def resolve_all_dialogues(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Dialogue, orderBy)

    def resolve_all_chatmessages(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(ChatMessage, orderBy)

    def resolve_all_comments(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Comment, orderBy)

    def resolve_all_stars(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Star, orderBy)

    def resolve_all_bookmarks(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Bookmark, orderBy)

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
    create_chatmessage = CreateChatMessage.Field()
    create_bookmark = CreateBookmark.Field()
    create_chatroom = CreateChatRoom.Field()
    create_favorite_chatroom = CreateFavoriteChatRoom.Field()
    update_answer = UpdateAnswer.Field()
    update_question = UpdateQuestion.Field()
    update_puzzle = UpdatePuzzle.Field()
    update_star = UpdateStar.Field()
    update_comment = UpdateComment.Field()
    update_bookmark = UpdateBookmark.Field()
    update_chatroom = UpdateChatRoom.Field()
    update_hint = UpdateHint.Field()
    update_current_award = UpdateCurrentAward.Field()
    update_user = UpdateUser.Field()
    delete_bookmark = DeleteBookmark.Field()
    login = UserLogin.Field()
    logout = UserLogout.Field()
    register = UserRegister.Field()
