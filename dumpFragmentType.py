#!/usr/bin/env python3
'''isort:skip_file'''
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cindy.settings")

import json
import django
django.setup()

from schema import schema

query = '''
{
  __schema {
    types {
      kind
      name
      possibleTypes {
        name
      }
    }
  }
}
'''

result = schema.execute(query)
print(json.dumps(result.data, indent=2))
