First of all, thanks for contributing!

Contribute
----------
All means of contributions are Welcome!

If you are familiar with `python`, `nodejs` or `html`,
don't hesitate to [make your own changes](#improving-codes) to it!
You can even improve this `README.md` page if you have some `markdown` skills!

If you are not familiar with a programming language
but have some fastinating ideas, [leave your comments](#posting-issues)
for us!

### Posting Issues
1. Go to [issues page](https://github.com/heyrict/cindy/issues)

1. Press `New Issue` button.

1. Leave your comments!

### Improving codes
1. Fork this project.

1. Pull *your forked repo* to your local machine.

    `git clone http://github.com/your_user_name/your_folked_repo.git`


1. Create a new branch `develop` or something else
    like `a-new-feature` on your local machine.

    `git checkout -b name_of_your_new_branch`

1. Do some editing & commit it

    ```bash
    # edit...
    git status  # check your edits
    git add -A  # add all updated files to cache
    git commit -m "your commit message"  # commit it
    git push origin name_of_your_new_branch
    ```

1. Start a pull request

**Some detailed information for building this website on your machine are described in the following sections.**


Migrating from Cindy
--------------------
*WARNING*: The database has some major changes in Cindy-Realtime, which means you *CANNOT* upgrade from Cindy
simply running `python3 manage.py makemigrations && python3 manage.py migrate`,
which can modify your database but will *DROP SOME EXISTING DATA*.

To upgrade from Cindy
- Make sure you are at a node *BEFORE* an existing `cindy@v5.X` tag.
- Checkout to branch relay-channels: `git checkout origin/relay-channels`
- Run `upgrade.py` under `./upgrade-from-cindy/` folder

    depending on how your database is initialized, you may have to manually add the `RenameField`s in migration files.

- Make sure you have your previous files in `/sui_hei/migrations`.
  If not, run `python3 manage.py migrate` in `cindy-realtime@v0.0.0`,
  which will give you a initialized migration file. Checkout to `cindy-realtime@master` after that.
- Then upgrade the database as you did before `python3 manage.py makemigrations; python3 manage.py migrate`


How To Run This Site On Your Machine
------------------------------------
1. Clone this repo to your machine if you have `git`,
    otherwize download the zip archive by clicking the
    button up-right.
2. [Install requisitories](#requisitories).
    Make sure `python3` exists in your PATH.

3. Configure your MySQL database
    - customize `cindy/mysql.cnf` file. A template is [here](./mysql.cnf.template).
    - open mysql, create a user and a database, grant all previlidges to it.

        ```sql
        # note that you need to chage all <>s to the value in your mysql.cnf.
        create database <database> character set utf-8;
        create user '<user>'@'<host>' identified by <password>;
        grant all on <database> to '<user>'@'<host>';
        quit
        ```
    - have django generate the database for you

        ```bash
        python3 manage.py makemigrations   # Alternatively, drag `manage.py` to the
        python3 manage.py migrate          # terminal to avoid `cd` operations.
        ```

4. Run server on your localhost.
    - For Linux Users or Mac Users,
        `cd` to the root of the cloned/unzipped folder,
        and run `python3 manage.py runserver`.
    - For Windows Users,
        open a `cmd` window, and type
        `python3 <drag the manage.py here> runserver`
5. Open the link (http://localhost:8000) appeared in your terminal/cmd with a browser.


For Programmers
----------------
This chapter is specially for explaning the whole project to programmers.

### Data structure
```
.
├── cindy
│   ├── __init__.py
│   ├── settings.py
│   ├── security.py.template                # Security configurations. please
│   │                                       #  rename it to `security.py` for your preferences.
│   ├── urls.py
│   └── wsgi.py
├── mysql.cnf.template                      # tempate of config of mysql. please
│                                           #  rename it to `mysql.cnf` for your preferences.
├── LICENSE                                 # licence file
├── manage.py                               # auto-generated manage script by django
├── README.md                               # the description file you are reading!
├── locale/                                 # folder storing language files
└── sui_hei/                                # folder storing the main site project.
    ├── admin.py                            # modules visible in /admin
    ├── apps.py                             # apps config file.
    ├── models.py                           # models storing data structure.
    ├── static/                             # folder storing static files, e.g. css, js, png, etc.
    ├── templates                           #  folder storing HTML templates
    │   └── index.html                      #   entry point
    ├── tests.py                            # file for testing the project
    ├── urls.py                             # url patterns of the website
    ├── views.py                            # create pages from templates. Pass variables here.
    └── translation.py                      # modeltranslation
```

### You will surely need these commands
1. To update the database:

    `python3 manage.py makemigrations && python3 manage.py migrate`

    Do this after modifying, or making pulls with changes in `/sui_hei/models.py`.

1. To update the graphql schema files
    - Apply changes in `/sui_hei/schema.py`: `python3 manage.py graphql_schema`
    - Apply changes in `graphql\`query{}\`` in javascript: `npm run relay`

    ... or you can simply run `make schema` to update both.

1. To generate bundles

    - If you are developing, run `npm run debug-main`.
    - If you are deploying, run `npm run prod-main`.

    or you can run watch mode for webpack if you frequently update javascript files:

    `./node_modules/webpack -w`

1. To generate language files

    ```bash
    python3 manage.py makemessages -d djangojs --ignore node_modules
    python3 manage.py makemessages
    ```

1. To compile language files

    `python3 manage.py compilemessages`

### Trouble Shooting

#### I pulled the latest commit but the database won't update
The latest commit may have some changes in sui_hei/models.py and
you have to update your local database manually by running

```bash
python3 manage.py makemigrations && python3 manage.py migrate
```

