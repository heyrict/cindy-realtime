from itertools import chain

import django_filters
import graphene
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.db.models import Count, F, Q, Sum
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django_filters import FilterSet
from graphene import Field, relay, resolve_only_args
from graphene.types.objecttype import ObjectTypeOptions
from graphene.types.utils import yank_fields_from_attrs
from graphene.utils.props import props
from graphene_django import DjangoConnectionField
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from graphql_relay import from_global_id, to_global_id
from rx import Observable, Observer
from six import get_unbound_function

from awards import judgers

from .models import *
from .subscription import Subscription as SubscriptionType


MIN_CONTENT_SAFE_CREDIT = 1000


# {{{1 resolveLimitOffset
def resolveLimitOffset(qs, limit, offset):
    if isinstance(limit, int) and isinstance(offset, int):
        end = offset + limit
    elif isinstance(limit, int):
        end = limit
    else:
        end = None
    return qs[offset:end]


# {{{1 resolveFilter
def resolveFilter(qs, args, filters=[], filter_fields=[]):
    filters = {f: args[f] for f in filters if f in args}
    for filterName, className in filter_fields.items():
        filterValue = args.get(filterName)
        if filterValue is None:
            continue
        try:
            filters[filterName] = className.objects.get(
                pk=from_global_id(filterValue)[1])
        except Exception as e:
            print("resolveFilter:", e)
            continue

    if len(filters) > 0:
        qs = qs.filter(**filters)

    return qs


# {{{1 resolveOrderBy
def resolveOrderBy(qs, order_by):
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
        return qs.order_by(*fieldQueries)
    else:
        return qs.all()


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

    can_review_award_application = graphene.Boolean()

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

    def resolve_can_review_award_application(self, info):
        return self.has_perm("sui_hei.can_review_award_application")


# {{{2 AwardNode
class AwardNode(DjangoObjectType):
    class Meta:
        model = Award
        filter_fields = ["groupName"]
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 AwardApplicationNode
class AwardApplicationNode(DjangoObjectType):
    class Meta:
        model = AwardApplication
        filter_fields = ['applier']
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


# {{{2 PuzzleNode
class PuzzleNode(DjangoObjectType):
    class Meta:
        model = Puzzle
        filter_fields = []
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


# {{{2 UserAwardNode
class UserAwardNode(DjangoObjectType):
    class Meta:
        model = UserAward
        filter_fields = []
        interfaces = (relay.Node, )

    rowid = graphene.Int()

    def resolve_rowid(self, info):
        return self.id


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


# {{{2 FavoriteChatRoomNode
class FavoriteChatRoomNode(DjangoObjectType):
    class Meta:
        model = FavoriteChatRoom
        filter_fields = ['user']
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


# {{{1 Connections
# {{{2 PuzzleConnection
class PuzzleConnection(graphene.Connection):
    total_count = graphene.Int()

    class Meta:
        node = PuzzleNode


# {{{1 Unions
# {{{2 PuzzleShowUnion
class PuzzleShowUnion(graphene.Union):
    class Meta:
        types = (DialogueNode, HintNode)


class PuzzleShowUnionConnection(relay.Connection):
    class Meta:
        node = PuzzleShowUnion


# {{{1 Subscriptions
# {{{2 PuzzleSubscription
class PuzzleSubscription(SubscriptionType):
    class Meta:
        output = PuzzleNode

    class Arguments:
        id = graphene.String()

    @classmethod
    def subscribe(cls, info):
        return [Puzzle]

    @classmethod
    def next(cls, pk_model, info, *, chatroomName=None):
        if model_label == 'sui_hei.chatmessage':
            obj = ChatMessage.objects.get(id=pk)
            if chatroomName:
                if chatroomName == obj.chatroom.name:
                    return obj
                return
            return obj

    @classmethod
    def next(cls, pk_model, info, *, id=None):
        pk, model_label = pk_model
        if model_label == 'sui_hei.puzzle':
            obj = Puzzle.objects.get(id=pk)
            if id:
                if id == to_global_id('PuzzleNode', obj.id):
                    return obj
                return
            return obj


# {{{2 DialogueSubscription
class DialogueSubscription(SubscriptionType):
    class Meta:
        output = DialogueNode

    @classmethod
    def subscribe(cls, info):
        return [Dialogue]

    @classmethod
    def next(cls, pk_model, info):
        pk, model_label = pk_model
        if model_label == 'sui_hei.dialogue':
            obj = Dialogue.objects.get(id=pk)
            return obj


# {{{2 PuzzleShowUnionSubscription
class PuzzleShowUnionSubscription(SubscriptionType):
    class Meta:
        output = PuzzleShowUnion

    class Arguments:
        id = graphene.String()

    @classmethod
    def subscribe(cls, info):
        return [Dialogue, Hint]

    @classmethod
    def next(cls, pk_model, info, *, id=None):
        pk, model_label = pk_model
        if model_label == 'sui_hei.hint':
            obj = Hint.objects.get(id=pk)
        elif model_label == 'sui_hei.dialogue':
            obj = Dialogue.objects.get(id=pk)
        else:
            return

        if id:
            if id == to_global_id('PuzzleNode', obj.puzzle.id):
                return obj
            return
        return obj


# {{{2 ChatMessageSubscription
class ChatMessageSubscription(SubscriptionType):
    class Meta:
        output = ChatMessageNode

    class Arguments:
        chatroomName = graphene.String()

    @classmethod
    def subscribe(cls, info):
        return [ChatMessage]

    @classmethod
    def next(cls, pk_model, info, *, chatroomName=None):
        pk, model_label = pk_model
        if model_label == 'sui_hei.chatmessage':
            obj = ChatMessage.objects.get(id=pk)
            if chatroomName:
                if chatroomName == obj.chatroom.name:
                    return obj
                return
            return obj


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
            content_safe=user.credit > MIN_CONTENT_SAFE_CREDIT
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
        chatroomName = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        content = input['content']
        chatroomName = input['chatroomName']
        chatroom = ChatRoom.objects.get(name=chatroomName)

        if not content:
            raise ValidationError(_("ChatMessage cannot be empty!"))

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


# {{{2 CreateAwardApplication
class CreateAwardApplication(graphene.ClientIDMutation):
    award_application = graphene.Field(AwardApplicationNode)

    class Input:
        awardId = graphene.String()
        comment = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        className, awardId = from_global_id(input["awardId"])
        comment = input["comment"]
        assert className == 'AwardNode'

        award = Award.objects.get(pk=awardId)

        if AwardApplication.objects.filter(applier=user, status=0).count() > 2:
            raise ValidationError(
                _("You can apply up to 2 awards at the same time!"))

        if UserAward.objects.filter(user=user, award=award).count() != 0:
            raise ValidationError(_("You already have this award!"))

        if AwardApplication.objects.filter(
                applier=user, award=award, status=0).count() != 0:
            raise ValidationError(_("You already have applied this award!"))

        awardapp = AwardApplication.objects.create(
            applier=user, comment=comment, award=award)

        return CreateAwardApplication(award_application=awardapp)


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
        status = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        puzzleId = input['puzzleId']
        yami = input.get('yami')
        solution = input.get('solution')
        memo = input.get('memo')
        status = input.get('status')

        if solution == '':
            raise ValidationError(_("Solution cannot be empty!"))

        puzzle = Puzzle.objects.get(id=puzzleId)

        if yami is not None:
            puzzle.yami = yami

        if solution:
            puzzle.solution = solution

        if memo is not None:
            puzzle.memo = memo

        if status:
            if status == 1 and puzzle.status == 0:
                puzzle.modified = timezone.now()
            puzzle.status = status

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
            raise ValidationError(_("You are not the creator of this hint"))

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
                raise ValidationError(_("You are not the owner of this award"))
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


# {{{2 UpdateAwardApplication
class UpdateAwardApplication(relay.ClientIDMutation):
    award_application = graphene.Field(AwardApplicationNode)

    class Input:
        awardApplicationId = graphene.String()
        status = graphene.Int()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated
                or not user.has_perm('sui_hei.can_review_award_application')):
            raise ValidationError(_("You are not authenticated to do this!"))

        nodeName, awardApplicationId = from_global_id(
            input['awardApplicationId'])
        status = input.get('status')

        assert nodeName == 'AwardApplicationNode'

        application = AwardApplication.objects.get(id=awardApplicationId)
        if status and application.status == 0:
            if (user == application.applier and not user.is_staff):
                raise ValidationError(
                    _("Only staff members can review self-applied award applications"
                      ))

            application.status = status
            application.reviewer = user
            application.reviewed = timezone.now()
            if status == 1:
                UserAward.objects.get_or_create(
                    user=application.applier, award=application.award)

        application.save()
        return UpdateAwardApplication(award_application=application)


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


# {{{2 DeleteFavoriteChatRoom
class DeleteFavoriteChatRoom(graphene.ClientIDMutation):
    class Input:
        chatroomName = graphene.String()

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        user = info.context.user
        if (not user.is_authenticated):
            raise ValidationError(_("Please login!"))

        chatroomName = input["chatroomName"]
        chatroom = ChatRoom.objects.get(name=chatroomName)
        FavoriteChatRoom.objects.filter(chatroom=chatroom, user=user).delete()

        return DeleteFavoriteChatRoom()


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
    all_award_applications = DjangoFilterConnectionField(
        AwardApplicationNode, orderBy=graphene.List(of_type=graphene.String))
    all_userawards = DjangoFilterConnectionField(
        UserAwardNode, orderBy=graphene.List(of_type=graphene.String))
    all_puzzles = graphene.ConnectionField(
        PuzzleConnection,
        orderBy=graphene.List(of_type=graphene.String),
        user=graphene.ID(),
        status=graphene.Float(),
        status__gt=graphene.Float(),
        title__contains=graphene.String(),
        created__year=graphene.Int(),
        created__month=graphene.Int(),
        limit=graphene.Int(),
        offset=graphene.Int())
    all_dialogues = DjangoFilterConnectionField(
        DialogueNode, orderBy=graphene.List(of_type=graphene.String))
    all_chatmessages = DjangoFilterConnectionField(
        ChatMessageNode,
        orderBy=graphene.List(of_type=graphene.String),
        chatroomName=graphene.String())
    all_chatrooms = DjangoFilterConnectionField(ChatRoomNode)
    all_favorite_chatrooms = DjangoFilterConnectionField(FavoriteChatRoomNode)
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
        return resolveOrderBy(User.objects, orderBy)

    def resolve_all_awards(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Award.objects, orderBy)

    def resolve_all_award_applications(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(AwardApplication.objects, orderBy)

    def resolve_all_userawards(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(UserAward.objects, orderBy)

    def resolve_all_puzzles(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", [])
        limit = kwargs.get("limit", None)
        offset = kwargs.get("offset", None)
        qs = Puzzle.objects.all()
        if "starCount" in orderBy or "-starCount" in orderBy:
            qs = qs.annotate(starCount=Count("star"))
        if "starSum" in orderBy or "-starSum" in orderBy:
            qs = qs.annotate(starSum=Sum("star__value"))
        if "commentCount" in orderBy or "-commentCount" in orderBy:
            qs = qs.annotate(commentCount=Count("comment"))
        qs = resolveOrderBy(qs, orderBy)
        qs = resolveFilter(
            qs,
            kwargs,
            filters=[
                "status",
                "status__gt",
                "created__year",
                "created__month",
                "title__contains",
            ],
            filter_fields={"user": User})
        total_count = qs.count()
        qs = resolveLimitOffset(qs, limit, offset)
        qs = list(qs)
        return PuzzleConnection(
            total_count=total_count,
            edges=[
                PuzzleConnection.Edge(node=qs[i], ) for i in range(len(qs))
            ])

    def resolve_all_dialogues(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Dialogue.objects, orderBy)

    def resolve_all_chatmessages(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        chatroomName = kwargs.get("chatroomName", None)
        qs = resolveOrderBy(ChatMessage.objects, orderBy)
        if chatroomName:
            chatroom = ChatRoom.objects.get(name=chatroomName)
            return qs.filter(chatroom=chatroom)
        return qs

    def resolve_all_comments(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Comment.objects, orderBy)

    def resolve_all_stars(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Star.objects, orderBy)

    def resolve_all_bookmarks(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(Bookmark.objects, orderBy)

    def resolve_all_award_applications(self, info, **kwargs):
        orderBy = kwargs.get("orderBy", None)
        return resolveOrderBy(AwardApplication.objects, orderBy)

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
    create_award_application = CreateAwardApplication.Field()
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
    update_award_application = UpdateAwardApplication.Field()
    delete_bookmark = DeleteBookmark.Field()
    delete_favorite_chatroom = DeleteFavoriteChatRoom.Field()
    login = UserLogin.Field()
    logout = UserLogout.Field()
    register = UserRegister.Field()


# {{{1 Subscription
class Subscription(graphene.ObjectType):
    puzzle_sub = PuzzleSubscription.Field()
    dialogue_sub = DialogueSubscription.Field()
    puzzle_show_union_sub = PuzzleShowUnionSubscription.Field()
    chatmessage_sub = ChatMessageSubscription.Field()
