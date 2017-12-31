#! /usr/bin/env python3
import os, re
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
MIGRATION_APPENDS_1 = "_relay_upgrade.py"
MIGRATION_APPENDS_2 = "_spec_upgrade.py"

last_migration_fn = None

prev_migration_1 = None
prev_migration_2 = None
dependency_migration_1 = None
dependency_migration_2 = None
new_migration_fn_1 = None
new_migration_fn_2 = None

if __name__ == "__main__":
    with open(os.path.join(DIR_PATH, "./migrate_from_cindy.py")) as f:
        migration = f.read()

    last_migration = 1
    for fn in os.listdir(os.path.join(DIR_PATH, "../sui_hei/migrations/")):
        current_migration = re.findall(r"^\d+", fn)

        if current_migration and int(current_migration[0]) > last_migration:
            last_migration = int(current_migration[0])
            last_migration_fn, _ = os.path.splitext(fn)

        if re.findall(MIGRATION_APPENDS_1 + "$", fn):
            prev_migration_1 = os.path.splitext(fn)[0]
        if re.findall(MIGRATION_APPENDS_2 + "$", fn):
            prev_migration_2 = os.path.splitext(fn)[0]

    print("Last migration file: ", last_migration_fn)

    assert last_migration_fn != None

    dependency_migration_1 = last_migration_fn
    dependency_migration_2 = new_migration_fn_1 if prev_migration_1 == None else prev_migration_1

    if prev_migration_1 == None:
        new_migration_fn_1 = str(last_migration + 1).zfill(4) + MIGRATION_APPENDS_1
        last_migration += 1
        with open(os.path.join(DIR_PATH, "../sui_hei/migrations/") + new_migration_fn_1, "w") as f:
            f.write(migration % dependency_migration_1)

    if prev_migration_2 == None:
        new_migration_fn_2 = str(last_migration + 1).zfill(4) + MIGRATION_APPENDS_2
        last_migration += 1
        with open(os.path.join(DIR_PATH, "../sui_hei/migrations/") + new_migration_fn_2, "w") as f:
            f.write(migration % dependency_migration_2)

