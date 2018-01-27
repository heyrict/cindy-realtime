/*
 *
 * Chat constants
 *
 */

import { componentsUserFragment } from 'containers/PuzzleActiveList/constants';

export const TOGGLE_MINICHAT = 'app/Chat/TOGGLE_MINICHAT';
export const TOGGLE_MEMO = 'app/Chat/TOGGLE_MEMO';
export const CHANGE_CHANNEL = 'app/Chat/CHANGE_CHANNEL';

export const CHANGE_TAB = 'app/Chat/CHANGE_TAB';
export const TABS = {
  TAB_CHAT: 'TAB_CHAT',
  TAB_CHANNEL: 'TAB_CHANNEL',
  TAB_DIRECTCHAT: 'TAB_DIRECTCHAT',
};

export const OPEN_MEMO = 'app/Chat/OPEN_MEMO';
export const CLOSE_MEMO = 'app/Chat/CLOSE_MEMO';

export const OPEN_MINICHAT = 'app/Chat/OPEN_MINICHAT';
export const CLOSE_MINICHAT = 'app/Chat/CLOSE_MINICHAT';

export const MINICHAT_CONNECT = 'ws/MINICHAT_CONNECT';
export const MINICHAT_DISCONNECT = 'ws/MINICHAT_DISCONNECT';

export const MINICHAT_ADDED = 'ws/MINICHAT_ADDED';
export const ADD_MINICHAT = 'app/Chat/ADD_MINICHAT';

export const MINICHAT_MORE = 'app/Chat/MINICHAT_MORE';
export const MORE_MINICHAT = 'app/Chat/MORE_MINICHAT';

export const INIT_MINICHAT = 'app/Chat/INIT_MINICHAT';

export const CHANGE_DIRECTCHAT = 'app/Chat/CHANGE_DIRECTCHAT';
export const SEND_DIRECTCHAT = 'ws/SEND_DIRECTCHAT';
export const DIRECTCHAT_RECEIVED = 'ws/DIRECTCHAT_RECEIVED';
export const ADD_DIRECTCHAT_MESSAGE = 'app/Chat/ADD_DIRECTCHAT_MESSAGE';

export const OPEN_CHAT = 'app/Chat/OPEN_CHAT';
export const OPEN_DIRECTCHAT = 'app/Chat/OPEN_DIRECTCHAT';

export const PublicChannels = ['lobby', '5-7-5'];

// {{{ const minichatFragment
const minichatFragment = `
  fragment components_minichat on MinichatNode {
    id
    content
    user {
      ...components_user
    }
  }
  ${componentsUserFragment}
`;
// }}}

// {{{ const minichatQuery
export const minichatQuery = `
  query($channel: String!) {
    allMinichats(channel: $channel, last: 10, orderBy: "id") {
      pageInfo {
        startCursor
        hasPreviousPage
      }
      edges {
        node {
          ...components_minichat
        }
      }
    }
  }
  ${minichatFragment}
`;
// }}}

// {{{ const minichatMoreQuery
export const minichatMoreQuery = `
  query($channel: String!, $before: String!) {
    allMinichats(channel: $channel, last: 10, before: $before, orderBy: "id") {
      pageInfo {
        startCursor
        hasPreviousPage
      }
      edges {
        node {
          ...components_minichat
        }
      }
    }
  }
  ${minichatFragment}
`;
// }}}

// {{{ const minichatUpdateQuery
export const minichatUpdateQuery = `
  query($id: ID!) {
    minichat(id: $id) {
      ...components_minichat
    }
  }
  ${minichatFragment}
`;
// }}}
