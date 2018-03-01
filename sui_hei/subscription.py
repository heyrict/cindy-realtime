from collections import OrderedDict

import graphene
from django.contrib.contenttypes.models import ContentType
from graphene import Field
from graphene.types.objecttype import ObjectTypeOptions
from graphene.types.utils import yank_fields_from_attrs
from graphene.utils.props import props
from rx import Observable
from six import get_unbound_function


class SubscriptionOptions(ObjectTypeOptions):
    arguments = None
    output = None
    resolver = None


class Subscription(graphene.ObjectType):
    @classmethod
    def __init_subclass_with_meta__(cls,
                                    resolver=None,
                                    output=None,
                                    arguments=None,
                                    _meta=None,
                                    **options):
        if not _meta:
            _meta = SubscriptionOptions(cls)

        output = output or getattr(cls, 'Output', None)
        fields = {}
        if not output:
            # If output is defined, we don't need to get the fields
            fields = OrderedDict()
            for base in reversed(cls.__mro__):
                fields.update(yank_fields_from_attrs(base.__dict__, _as=Field))
            output = cls

        if not arguments:
            input_class = getattr(cls, 'Arguments', None)

            if input_class:
                arguments = props(input_class)
            else:
                arguments = {}

        if not resolver:
            assert hasattr(
                cls,
                'next'), 'All subscriptions must define a next method in it'
            resolver = get_unbound_function(getattr(cls, 'resolver'))

        if _meta.fields:
            _meta.fields.update(fields)
        else:
            _meta.fields = fields

        _meta.output = output
        _meta.resolver = resolver
        _meta.arguments = arguments

        super(Subscription, cls).__init_subclass_with_meta__(
            _meta=_meta, **options)

    @classmethod
    def subscribe(cls, info):
        return cls._meta.output._meta.model

    @classmethod
    def resolver(cls, obj, info, **kwargs):
        subscribe = info.context.subscribe
        if subscribe:
            models = cls.subscribe(info)
            if not isinstance(models, list):
                models = [models]

            for model in models:
                ct = ContentType.objects.get_for_model(model)
                model_label = '.'.join([ct.app_label, ct.model])
                subscribe(model_label)

        observable = info.root_value
        return observable.map(lambda obj: cls.next(obj, info, **kwargs))

    @classmethod
    def Field(cls, *args, **kwargs):
        return Field(
            cls._meta.output,
            args=cls._meta.arguments,
            resolver=cls._meta.resolver)
