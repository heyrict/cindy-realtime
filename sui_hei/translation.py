from modeltranslation.translator import TranslationOptions, register

from .models import Award


@register(Award)
class AwardTranslationOptions(TranslationOptions):
    fields = (
        'name',
        'description',
        'requisition',
    )
