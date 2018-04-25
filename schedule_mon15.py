'''isort:skip_file'''
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")

import django
django.setup()

from awards import judgers

if __name__ == "__main__":
    judgers['best_of_month'].execute(None)
