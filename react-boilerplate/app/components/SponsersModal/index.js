/**
 *
 * SponsersModal
 *
 */

import React from 'react';
import withModal from 'components/withModal';
// import styled from 'styled-components';

function Sponsers() {
  return (
    <table
      width="490"
      cellSpacing="1"
      style={{ width: '100%', fontSize: '1.2em' }}
    >
      <tbody>
        <tr>
          <td colSpan="3">
            <b>
              <a
                href="http://sui-hei.net/main/rule"
                target="_blank"
                title="つい見てしまう・・・"
              >
                ラテシン[休止中]
              </a>
            </b>
            <a
              href="http://sui-hei.net/app/webroot/pukiwiki/"
              target="_blank"
              title="最新情報の確認はこちら"
            >
              (ラテシンwiki)
            </a>
          </td>
        </tr>
        <tr>
          <td colSpan="3">
            <b>Play</b>
            (出題)
          </td>
        </tr>
        <tr>
          <td width="245">
            <a
              href="https://www.cindythink.com/"
              target="_blank"
              title="はやてさん設置の後継サイト(ここ)"
            >
              Cindy
            </a>
            <a
              href="https://wiki3.jp/cindy-lat"
              target="_blank"
              title="エルナトさん作成のCindy wiki"
            >
              (wiki)
            </a>
          </td>
          <td width="245">
            <a
              href="http://openumigame.sakura.ne.jp/openumi/"
              target="_blank"
              title="Ratterさん設置の後継サイト"
            >
              Openウミガメ R鯖
            </a>
          </td>
          <td width="245">
            <a
              href="https://utakata-umigame.herokuapp.com/"
              target="_blank"
              title="人参さん作成のうたかたウミガメ"
            >
              うたかたウミガメ
            </a>
          </td>
        </tr>
        <tr>
          <td colSpan="3">
            <b>Chat</b>
            (交流)
          </td>
        </tr>
        <tr>
          <td width="245">
            <a
              href="http://chat.kanichat.com/chat?roomid=Cindychat"
              target="_blank"
              title="Cindy公式チャット(現在も稼働中)"
              style={{ fontWeight: 'bold' }}
            >
              Cindy公式
            </a>
          </td>
          <td width="245">
            <a
              href="http://chat.kanichat.com/chat?roomid=suiheinet"
              target="_blank"
              title="ラテシン公式チャット(現在も稼働中)"
            >
              ラテシン公式
            </a>
          </td>
          <td width="245">
            <a
              href="http://chat.kanichat.com/chat?roomid=latethin"
              target="_blank"
              title="出題用チャット(テスト等に)"
            >
              出題用
            </a>
          </td>
        </tr>
        <tr>
          <td width="245">
            <a
              href="http://chat.kanichat.com/chat?roomid=NewComer"
              target="_blank"
              title="新人向け旧公式チャット"
            >
              ぱ～ら～
            </a>
          </td>
          <td width="245">
            <a
              href="http://chat.kanichat.com/chat?roomid=SandaiBanashi"
              target="_blank"
              title="ベテラン向け旧公式チャット"
            >
              Salon
            </a>
          </td>
          <td width="245">
            <a
              href="http://chat.kanichat.com/chat?roomid=lounge"
              target="_blank"
              title="TRPG募集＆告知用チャット"
            >
              TRPG
            </a>
          </td>
        </tr>
        <tr>
          <td width="245">
            <a
              href="https://discordapp.com/invite/6bETyMQ"
              target="_blank"
              title="ボイスチャットも可能なチャットツール"
            >
              DISCORD
            </a>
          </td>
        </tr>
        <tr>
          <td colSpan="3">
            <b>BBS</b>
          </td>
        </tr>
        <tr>
          <td width="245">
            <a
              href="http://bbs.mottoki.com/index?bbs=lateralthinking_chatroom_index"
              target="_blank"
              title="ムクさん管理の掲示板"
            >
              もっとき
            </a>
          </td>
          <td width="245">
            <a
              href="http://jbbs.shitaraba.net/bbs/subject.cgi/netgame/16002/"
              target="_blank"
              title="出題用掲示板"
            >
              したらば
            </a>
          </td>
          <td width="245" />
        </tr>
      </tbody>
    </table>
  );
}

export default withModal({ footer: { close: true } })(Sponsers);
