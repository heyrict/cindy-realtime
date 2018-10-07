Cindy-Realtime
==============
<img align="right" height="192" width="192" src="https://github.com/heyrict/cindy-realtime/blob/master/react-boilerplate/app/images/icon-512x512.png" />

日本語バーションは[こちら](README_ja.md)

This is a project started in homage to [latethin](http://sui-hei.net) created by [kamisugi(上杉)](http://sui-hei.net/mondai/profile/1).

Cindy is a website specially designed for playing lateral thinking games, with python django as the backend, and nodejs as the frontend.
It also used a lot of new features like GraphQL as WebAPI, WebSocket for auto-updating.

You can access the **[website](https://www.cindythink.com/ja/)**, or find useful informations in the unofficial **[wiki](https://wiki3.jp/cindy-lat)**.

The name of `Cindy` stands for **Cindy Is Not Dead Yet**,
which comes from the popular original character of [Cindy](http://sui-hei.net/app/webroot/pukiwiki/index.php?%E3%82%B7%E3%83%B3%E3%83%87%E3%82%A3).

Differences between Cindy
-------------------------
Cindy-Realtime inherit its database from [Cindy](https://github.com/heyrict/cindy), but its frontend is completely different from [Cindy](https://github.com/heyrict/cindy).

Cindy-Realtime has more features:

- WebSocket, to make a realtime chat-like application
- React, to UI more convenient, and more convenient for maintainance :smile:
- GraphQL & Relay, instead of original REST-like API, to make site load faster.

Though it has some drawbacks:

- Limited old browser support.
- Unable to deploy on a single-thread PaaS.

For these reasons, I decide to separate this repository out from Cindy.
*Both repos are under support at now*.

Requisitories
-----------
- [Python3.5](http://www.python.org)

    ```bash
    pip install -r requirements.txt
    ```
- Postgresql (you can opt to use mysql server using mysql.cnf)

    ```bash
    # Debian-based systems
    apt-get install postgresql
    ```

- Redis DB

    ```bash
    # Debian-based systems
    apt-get install redis-server
    ```

- nodejs manager (latest npm or bower, optional if you would like to use `assets.7z`)

    ```bash
    cd ./react-boilerplate && npm install

    # Use npm (bower is somewhat alike)
    ```

- Python Image Library and its dependencies (optional, if you want to enable `TWEET_WITH_IMAGE`)

    ```bash
    cd ./imaging && make setup && pip install -r requirements.txt
    ```

Develop
-------
1. Clone this repo.

    ```bash
    git clone https://github.com/heyrict/cindy-realtime
    ```

2. [Install requisitories](#requisitories).
    *Make sure `python` and `pip` exists in your PATH. You may want to use `python3` or `pip3` instead.*

3. Configure your Postgresql database
    - Open postgresql, create a user and a database, grant all previlidges to it.

      ```postgresql
      CREATE DATABASE cindy;
      CREATE USER cindy WITH PASSWORD 'cindy';
      ALTER ROLE cindy SET client_encoding TO 'utf8';
      ALTER ROLE cindy SET default_transaction_isolation TO 'read committed';
      ALTER ROLE cindy SET timezone TO 'UTC';
      GRANT ALL PRIVILEGES ON DATABASE cindy TO cindy;
      \q;
      ```
    - Edit `POSTGREDB_SETTINGS` in `./cindy/security.py` file according to your settings. A template is [here](./cindy/security.py.template).
    - Have django generate the necessary data for you

      ```bash
      python3 manage.py makemigrations && python3 manage.py migrate
      python3 manage.py compilemessages
      make schema
      make initdb
      ```

4. Build develop dependencies for nodejs

   ```bash
   # The process will run until you send SIGINT by pressing <Ctrl-C>
   # Open another terminal for the rest work
   cd ./react-boilerplate && npm run build:dll && npm run serve
   ```

5. Run server on your localhost.

   ```bash
   # The process will run until you send SIGINT by pressing <Ctrl-C>
   # Open another terminal for the rest work
   daphne cindy.asgi:application
   ```

6. Open http://127.0.0.1:8000 appeared in your terminal/cmd with a browser.
   The page will update instantly when you change your code.


Deploy
------
**Note**: This is one method of deployment using nginx under ubuntu16.04LTS. It's definitely OK to use other methods.
Also, note that all the configuration files need to be adjusted to you system (e.g. change username and /path/to/cindy, etc.)

1. Get production javascript assets

    1. Go through step 1 to 3 in [Develop](#develop). **Note that nodejs is optional in production**
    2. Collect javascript assets

      Download assets.7z [here](https://github.com/heyrict/cindy-realtime/releases) and unpack it.

      ```bash
      wget https://github.com/heyrict/cindy-realtime/releases/download/$CINDY_VERSION/assets.7z
      7zr x assets.7z
      ```

      or optionally if you want to build javascript assets yourself.

      ```bash
      cd ./react-boilerplate && npm run build
      ../manage.py collectstatic
      ```

2. Configure Nginx

   ```bash
   # Note that you may need su privileges to do this
   cp ./config/nginx-cindy-config /etc/nginx/sites-available/cindy
   ln -s /etc/nginx/sites-available/cindy /etc/nginx/sites-enabled
   # Obtaining SSL Certificate using certbot
   # Skip this command if you want to disable https protocol
   # (you may have to manually edit nginx-cindy-config to allow only http traffic)
   certbot --nginx -d cindy.com -d www.cindy.com
   service nginx restart
   ```

3. Configure daphne

   ```bash
   cp ./config/daphne.service /etc/systemd/system/
   systemctl enable daphne
   service daphne start
   ```

4. (Optionally, require [nodejs](#requisitories)) Configure Nginx with prerender instead of step 2 to 3

   ```bash
   # Note that you may need su privileges to do this
   ## Configure nginx
   cp ./config/nginx-cindy-config-nginx-cindy-config-with-prerender /etc/nginx/sites-available/cindy
   ln -s /etc/nginx/sites-available/cindy /etc/nginx/sites-enabled
   service nginx restart
   ## Configure daphne and prerender server
   cp ./config/prerender.service ./config/daphne.service /etc/systemd/system/
   systemctl enable daphne
   systemctl enable prerender
   service daphne start
   service prerender start
   ```

5. (Optionally, if you want to enable twitter bot, change settings in `# Twitter Bot` in [security.py](./cindy/security.py).
   Special [requisitories](#requisitories) are also needed for enabling `TWEET_WITH_PICTURE`.


FAQs
======
1. How to backup & restore cindy database

   > - To backup: `python manage.py dumpdata -o backup.json`
   >
   > - To restore on the same server (esp. with same files in sui-hei/migrations):
   >   `python manage.py loaddata -e contenttypes modified-backup.json`
   >
   > - To restore on different server, first you need to make sure your local database has no conflict with the backup file.
   >   If so, truncate your cindy database first (change `cindy` to database name or user name in your [config file](./cindy/security.py):
   >
   >   ```sql
   >   DROP DATABASE cindy;
   >   CREATE DATABASE cindy;
   >   GRANT ALL ON DATABASE cindy to cindy;
   >   ```
   >
   >   Then, load truncate your backup file and load it
   >
   >   ```bash
   >   python ./tools/truncate_contenttypes.py backup.json
   >   python manage.py loaddata -e contenttypes modified-backup.json
   >   rm modified-backup.json
   >   ```


Contributers
------------
- [kamisugi(上杉)](http://sui-hei.net/mondai/profile/1)
- [kamisan(上参)](https://github.com/pb10001)
- [shakkuri(しゃっくり)](http://sui-hei.net/mondai/profile/11752)
- [sarubobo(さるぼぼ)](http://sui-hei.net/mondai/profile/6664)
- [ernath(エルナト)](http://sui-hei.net/mondai/profile/15741)
