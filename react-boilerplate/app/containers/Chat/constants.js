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

export const CHATROOM_CONNECT = 'ws/CHATROOM_CONNECT';
export const CHATROOM_DISCONNECT = 'ws/CHATROOM_DISCONNECT';

export const CHATMESSAGE_ADDED = 'ws/CHATMESSAGE_ADDED';
export const ADD_CHATMESSAGE = 'app/Chat/ADD_CHATMESSAGE';

export const MINICHAT_MORE = 'app/Chat/MINICHAT_MORE';
export const MORE_MINICHAT = 'app/Chat/MORE_MINICHAT';

export const INIT_MINICHAT = 'app/Chat/INIT_MINICHAT';

export const CHANGE_DIRECTCHAT = 'app/Chat/CHANGE_DIRECTCHAT';
export const SEND_DIRECTCHAT = 'ws/SEND_DIRECTCHAT';
export const DIRECTCHAT_RECEIVED = 'ws/DIRECTCHAT_RECEIVED';
export const ADD_DIRECTCHAT_MESSAGE = 'app/Chat/ADD_DIRECTCHAT_MESSAGE';

export const OPEN_CHAT = 'app/Chat/OPEN_CHAT';
export const OPEN_DIRECTCHAT = 'app/Chat/OPEN_DIRECTCHAT';

export const GOTID_MINICHAT = 'app/Chat/GOTID_MINICHAT';
export const MINICHAT_GETID = 'app/Chat/MINICHAT_GETID';

export const ADD_FAVCHAN = 'app/Chat/ADD_FAVCHAN';
export const REMOVE_FAVCHAN = 'app/Chat/REMOVE_FAVCHAN';

export const PublicChannels = ['lobby', 'sp', 'yokoku'];

// {{{ const chatmessageFragment
const chatmessageFragment = `
  fragment components_chatmessage on ChatMessageNode {
    id
    content
    created
    editTimes
    user {
      ...components_user
    }
  }
  ${componentsUserFragment}
`;
// }}}

// {{{ const chatmessageQuery
export const chatmessageQuery = `
  query($chatroom: ID!) {
    allChatmessages(chatroom: $chatroom, last: 10, orderBy: "id") {
      pageInfo {
        startCursor
        hasPreviousPage
      }
      edges {
        node {
          ...components_chatmessage
        }
      }
    }
  }
  ${chatmessageFragment}
`;
// }}}

// {{{ const chatmessageMoreQuery
export const chatmessageMoreQuery = `
  query($chatroom: ID!, $before: String!) {
    allChatmessages(chatroom: $chatroom, last: 10, before: $before, orderBy: "id") {
      pageInfo {
        startCursor
        hasPreviousPage
      }
      edges {
        node {
          ...components_chatmessage
        }
      }
    }
  }
  ${chatmessageFragment}
`;
// }}}

// {{{ const chatmessageUpdateQuery
export const chatmessageUpdateQuery = `
  query($id: ID!) {
    chatmessage(id: $id) {
      ...components_chatmessage
    }
  }
  ${chatmessageFragment}
`;
// }}}

// {{{ const chatmessageIdQuery
export const chatmessageIdQuery = `
  query($name: String!) {
    allChatrooms(name: $name) {
      edges {
        node {
          id
          description
          created
          user {
            ...components_user
          }
        }
      }
    }
  }
  ${componentsUserFragment}
`;
// }}}
