from modeltranslation.translator import register, TranslationOptions
from .models import Award

@register(Award)
class AwardTranslationOptions(TranslationOptions):
    fields = ('name', 'description', )
