import os
import sys

import pandas as pd

fn = sys.argv[1]


def set_authperm_contenttype_one(s):
    if s['model'] == 'auth.permission':
        s['fields']['content_type'] = 1
    return s


if __name__ == '__main__':
    df = pd.read_json(fn)
    df = df.apply(set_authperm_contenttype_one, axis=1)
    df.to_json("modified-" + fn, orient="records")
