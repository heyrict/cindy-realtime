import re

from django.conf import settings
from django.conf.urls.i18n import is_language_prefix_patterns_used
from django.middleware.locale import LocaleMiddleware
from django.utils import translation
from django.utils.translation.trans_real import get_supported_language_variant

referer_language_code_prefix = re.compile(r'^https?://[^/]+/([^/]+)')


class GraphQLLocaleMiddleware(LocaleMiddleware):
    def process_request(self, request):
        if request.path_info == '/graphql':
            regex_match = referer_language_code_prefix.match(
                request.META.get('HTTP_REFERER', ''))
            if not regex_match:
                lang_code = None
            else:
                lang_code = regex_match.group(1)

            language = get_supported_language_variant(lang_code)
            if not language:
                language = 'en'

            translation.activate(language)
            request.LANGUAGE_CODE = translation.get_language()
            return

        return super(GraphQLLocaleMiddleware, self).process_request(request)
