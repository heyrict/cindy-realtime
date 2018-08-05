/*
 *
 * Chat constants
 *
 */

export const defaultChannel = (path) => {
  const match = path.match('/puzzle/show/([0-9]+)');
  if (match) return `puzzle-${match[1]}`;
  return 'lobby';
};

export const TOGGLE_MINICHAT = 'app/Chat/TOGGLE_MINICHAT';
export const TOGGLE_MEMO = 'app/Chat/TOGGLE_MEMO';
export const CHANGE_CHANNEL = 'app/Chat/CHANGE_CHANNEL';

export const CHANGE_TAB = 'app/Chat/CHANGE_TAB';
export const TABS = {
  TAB_CHAT: 'TAB_CHAT',
  TAB_CHANNEL: 'TAB_CHANNEL',
  TAB_DIRECTCHAT: 'TAB_DIRECTCHAT',
  TAB_BROADCAST: 'TAB_BROADCAST',
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
export const DIRECTCHAT_RECEIVED = 'app/Chat/DIRECTCHAT_RECEIVED';

export const OPEN_CHAT = 'app/Chat/OPEN_CHAT';
export const OPEN_DIRECTCHAT = 'app/Chat/OPEN_DIRECTCHAT';

export const GOTID_MINICHAT = 'app/Chat/GOTID_MINICHAT';
export const MINICHAT_GETID = 'app/Chat/MINICHAT_GETID';

export const ADD_FAVCHAN = 'app/Chat/ADD_FAVCHAN';
export const REMOVE_FAVCHAN = 'app/Chat/REMOVE_FAVCHAN';

export const PublicChannels = ['lobby'];

export const SET_DM_RECEIVER = 'app/Chat/SET_DM_RECEIVER';

export const SEND_BROADCAST = 'app/Chat/SEND_BROADCAST';
