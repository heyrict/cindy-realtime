from django.apps import AppConfig
from django.utils.translation import ugettext_lazy as _


class SuiHeiConfig(AppConfig):
    name = 'sui_hei'
    verbose_name = _('Lateral Thinking')

    def ready(self):
        import sui_hei.signals
