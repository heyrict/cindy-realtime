#! /usr/bin/env python3
import os, re
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
MIGRATION_APPENDS = "_relay_upgrade.py"

if __name__ == "__main__":
    with open(os.path.join(DIR_PATH, "./migrate_from_cindy.py")) as f:
        migration = f.read()

    last_migration = 1
    for fn in os.listdir(os.path.join(DIR_PATH, "../sui_hei/migrations/")):
        current_migration = re.findall(r"^\d+", fn)
        last_migration_fn = None

        if current_migration and int(current_migration[0]) > last_migration:
            last_migration = int(current_migration[0])
            last_migration_fn, _ = os.path.splitext(fn)

    new_migration_fn = str(last_migration + 1).zfill(4) + MIGRATION_APPENDS

    with open(os.path.join(DIR_PATH, "../sui_hei/migrations/") + new_migration_fn, "w") as f:
        f.write(migration % last_migration_fn)
