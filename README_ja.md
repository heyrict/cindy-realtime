Cindy-Realtime
==============
<img align="right" height="192" width="192" src="https://github.com/heyrict/cindy-realtime/blob/master/react-boilerplate/app/images/icon-192x192.png" />

[ラテシン](http://sui-hei.net)(製作者：[上杉さん](http://sui-hei.net/mondai/profile/1))の後継として始まったプロジェクトです。

Cindy(シンディ)は水平思考ゲームをプレイするためのWebサイトです。バックエンドにPythonのWebフレームワークであるDjango、フロントエンドにNode.jsを用いています。  
その他の技術的特徴として、WebAPIにGraphQL、リアルタイム更新にWebSocketを用いています。

**[Webサイト](https://www.cindythink.com/ja/)** はこちら  
Cindyの遊び方については非公式 **[Wiki](https://wiki3.jp/cindy-lat)** をご参照ください。

`Cindy`という名前は**Cindy Is Not Dead Yet**(シンディは死んでいない)の頭文字をとって名付けられました。[Cindy](http://sui-hei.net/app/webroot/pukiwiki/index.php?%E3%82%B7%E3%83%B3%E3%83%87%E3%82%A3)はラテシンのキャラクターです。

<div style="clear:both;" />

旧Cindyとの違い
-------------------------
Cindy-Realtimeは旧[Cindy][1]からデータを引き継いでいますが、フロントエンドを刷新しました。

Cindy-Realtimeの変更点
    - リアルタイム方式を採用(WebSocket)
    - ReactによるUIの改良、保守性の向上 :smile:
    - GraphQLとRelayを導入し、RESTライクなAPIより高速な読み込みを実現

逆にできなくなったこともあります。
    - 古いブラウザのサポートを終了
    - シングルスレッドのPaaSにはデプロイ不可能

これらの大幅な変更のために、旧CindyとCindy-Realtimeは別のリポジトリとして公開しています。
*今のところ、どちらのリポジトリもサポート中です*

要件
-----------
- [Python3.5](http://www.python.org)

    ```bash
    pip install -r requirements.txt
    ```
- Postgresql (MySQLを使う場合はmysql.cnfを使用)

    ```bash
    # Debian-based systems
    apt-get install postgresql
    ```

- Redis DB

    ```bash
    # Debian-based systems
    apt-get install redis-server
    ```

- nodejs manager (最新のnpmまたはbower、`assets.7z`を使いたい場合のみ)

    ```bash
    cd ./react-boilerplate && npm install

    # Use npm (bower is somewhat alike)
    ```

コミットする
-------
1. リポジトリをクローンする

    ```bash
    git clone https://github.com/heyrict/cindy-realtime
    ```

2. [必須アプリケーションをインストールする](#要件).
    *`python`と`pip`をPATHに設定してください。`python3`や`pip3`を使うこともできます。*
3. PostgreSQLの設定
    - postgresqlを開き、ユーザーとデータベースを作成してすべての権限を許可します。

      ```postgresql
      CREATE DATABASE cindy;
      CREATE USER cindy WITH PASSWORD 'cindy';
      ALTER ROLE cindy SET client_encoding TO 'utf8';
      ALTER ROLE cindy SET default_transaction_isolation TO 'react committed';
      ALTER ROLE cindy SET timezone TO 'UTC';
      GRANT ALL PRIVILEGES ON DATABASE cindy TO cindy;
      \q;
      ```

    - `POSTGREDB_SETTINGS` in `./cindy/security.py` ファイルをご自身の設定に従って編集します。
      テンプレートは[こちら](./cindy/security.py.template).
    - djangoを使って必要なデータを生成します。

      ```bash
      python3 manage.py makemigrations && python3 manage.py migrate
      python3 manage.py compilemessages
      make schema
      ```

4. Node.jsの依存関係を解決してビルドします。

   ```bash
   cd ./react-boilerplate && npm run build:dll && npm run serve
   ```

5. localhostでサーバーを起動します。

   ```bash
   daphne cindy.asgi:application
   ```

6. ターミナル/コマンドプロンプトに表示されたリンクにアクセスします。


デプロイ
------
**注意**: これはnginx, ubuntu16.04LTSを使った場合の例です。別の方法も可能です。  
また、設定ファイルをご自身のシステムに合わせて変更することにご注意ください(例えばユーザー名、パスなど)。

1. JavaScriptのアセットを取得する
    - Method 1

      1.  [コミットする](#コミットする)の1-3を実行する。**Node.jsは必須ではないこと必須ではないことに注意**
      2. javascriptのアセットを収集

       [こちら](https://github.com/heyrict/cindy-realtime/releases)からassets.7zをダウンロードして展開します。

       ```bash
       wget https://github.com/heyrict/cindy-realtime/releases/download/$CINDY_VERSION/assets.7z
       7zr x assets.7z
       ```

       ご自身でビルドする場合

       ```bash
       cd ./react-boilerplate && npm run build
       ../manage.py collectstatic
       ```

2. Nginxの設定

   ```bash
   # 管理者権限が必要な場合があることにご注意ください。
   cp ./config/nginx-cindy-config /etc/nginx/sites-available/cindy
   ln -s /etc/nginx/sites-available/cindy /etc/nginx/sites-enabled
   # certbotを使ってSSL認証します
   # HTTPSを有効にしない場合はスキップしてください。
   # (HTTPのみを有効にする場合はnginx-cindy-configを手動で編集してください。)
   certbot --nginx -d cindy.com -d www.cindy.com
   service nginx restart
   ```

3. daphneの設定

   ```bash
   cp ./config/daphne.service /etc/systemd/system/
   systemctl enable daphne
   service daphne start
   ```

4. (以下は必須ではありません、 [nodejs](#要件)が必要です) step3-4の代わりにprerenderを使ったNginxの設定

   ```bash
   # 管理者権限が必要な場合があることにご注意ください。
   ## nginxの設定
   cp ./config/nginx-cindy-config-nginx-cindy-config-with-prerender /etc/nginx/sites-available/cindy
   ln -s /etc/nginx/sites-available/cindy /etc/nginx/sites-enabled
   service nginx restart
   ## daphneとprerenderの設定
   cp ./config/prerender.service ./config/daphne.service /etc/systemd/system/
   systemctl enable daphne
   systemctl enable prerender
   service daphne start
   service prerender start
   ```

プロジェクトの協力者
------------
- [kamisugi(上杉)](http://sui-hei.net/mondai/profile/1)
- [kamisan(上参)](https://github.com/pb10001)
- [shakkuri(しゃっくり)](http://sui-hei.net/mondai/profile/11752)
- [sarubobo(さるぼぼ)](http://sui-hei.net/mondai/profile/6664)
- [ernath(エルナト)](http://sui-hei.net/mondai/profile/15741)