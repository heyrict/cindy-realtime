#! /usr/bin/env python3
import os
import re

DIR_PATH = os.path.dirname(os.path.realpath(__file__))
MIG_PATH = os.path.join(DIR_PATH, "../sui_hei/migrations/")

migrates = [
    {
        "filename": "./migrate_from_cindy.py",
        "dependency": None,
        "appends": "_relay_upgrade.py",
    },
    {
        "filename": "./migrate_from_cindy_2.py",
        "dependency": None,
        "appends": "_spec_upgrade.py",
    },
    {
        "filename": "./migrate_from_cindy_3.py",
        "dependency": None,
        "appends": "_dialogue_rename_upgrade.py",
    },
]


def getLastMigration():
    """
    Get the last migration file with the largest prefix number.

    returns filename (no extension).
    """
    last_migration = 1
    last_migration_fn = None

    for fn in os.listdir(MIG_PATH):
        current_migration = re.findall(r"^\d+", fn)

        if current_migration and int(current_migration[0]) > last_migration:
            last_migration = int(current_migration[0])
            last_migration_fn, _ = os.path.splitext(fn)

    return last_migration, last_migration_fn


def fillDependencies(migrates):
    for fn in os.listdir(MIG_PATH):
        for i in range(len(migrates)):
            if re.findall(migrates[i]["appends"] + "$", fn):
                if i + 1 >= len(migrates):
                    return []

                migrates[i + 1]["dependency"] = fn
                migrates.pop(i)
                break

    last_migration, last_migration_fn = getLastMigration()

    if len(migrates) > 0:
        migrates[0]["dependency"] = last_migration_fn
        migrates[0]["output"] = str(last_migration + 1).zfill(
            4) + migrates[0]["appends"]
        last_migration += 1

        for i in range(1, len(migrates)):
            if migrates[i]["dependency"] == None:
                migrates[i]["dependency"] = migrates[i - 1]["output"][:-3]
                migrates[i]["output"] = str(last_migration + 1).zfill(
                    4) + migrates[i]["appends"]
                last_migration += 1

    return migrates


if __name__ == "__main__":
    for mig in fillDependencies(migrates):
        with open(os.path.join(DIR_PATH, mig["filename"])) as f:
            migration = f.read()

        # debug
        print("Find dependency migration file %s" % mig["dependency"])
        print("Adding new migration file %s...Done" % mig["output"])

        with open(os.path.join(MIG_PATH, mig["output"]), "w") as f:
            f.write(migration % mig["dependency"])
