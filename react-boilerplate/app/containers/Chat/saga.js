import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { gqlQuery } from 'Environment';
import {
  addDirectchatMessage,
  connectChat,
  disconnectChat,
  toggleChat,
  changeChannel,
} from './actions';
import {
  CHANGE_CHANNEL,
  TOGGLE_MINICHAT,
  OPEN_MINICHAT,
  CLOSE_MINICHAT,
  TOGGLE_MEMO,
  OPEN_MEMO,
  CLOSE_MEMO,
  OPEN_CHAT,
  CHATROOM_CONNECT,
  INIT_MINICHAT,
  MINICHAT_MORE,
  CHATMESSAGE_ADDED,
  ADD_CHATMESSAGE,
  MORE_MINICHAT,
  SEND_DIRECTCHAT,
  DIRECTCHAT_RECEIVED,
  GOTID_MINICHAT,
  chatmessageQuery,
  chatmessageMoreQuery,
  chatmessageUpdateQuery,
  chatmessageIdQuery,
} from './constants';
import { selectChatDomain } from './selectors';

const defaultChannel = (path) => {
  const match = path.match('/puzzle/show/([0-9]+)');
  if (match) return `puzzle-${match[1]}`;
  return 'lobby';
};

const getTrueChannel = (channel) => {
  if (channel === null) {
    return defaultChannel(window.location.pathname);
  }
  return channel;
};

function* onChangeLocation(action) {
  const width = window.innerWidth || document.documentElement.clientWidth;
  const chat = yield select(selectChatDomain);
  const chatOpen = chat.get('open');
  const chatChannel = chat.get('channel');
  const currentChannel = chat.get('currentChannel');

  if (width <= 720) {
    yield put({ type: CLOSE_MINICHAT });
    yield put(disconnectChat(currentChannel));
    return;
  }

  if (chatChannel === null && chatOpen === 'chat') {
    const nextChannel = defaultChannel(action.payload.pathname);
    if (nextChannel !== currentChannel) {
      yield put(disconnectChat(currentChannel));
      yield put(connectChat(nextChannel));
    }
  }
}

function* handleToggleChat(action) {
  const chat = yield select(selectChatDomain);
  const chatOpen = chat.get('open');
  const chatChannel = chat.get('channel');
  const nextChannel = getTrueChannel(chatChannel);
  if (chatOpen === 'chat' && action.open !== 'chat') {
    yield put({ type: CLOSE_MINICHAT });
    yield put(disconnectChat(nextChannel));
  } else if (chatOpen !== 'chat' && action.open !== null) {
    yield put({ type: OPEN_MINICHAT });
    yield put(connectChat(nextChannel));
  }
}

function* handleToggleMemo(action) {
  const chat = yield select(selectChatDomain);
  const chatOpen = chat.get('open');
  if (chatOpen === 'memo' && action.open !== 'memo') {
    yield put({ type: CLOSE_MEMO });
  } else if (chatOpen !== 'memo' && action.open !== null) {
    yield put({ type: OPEN_MEMO });
  }
}

function* handleChannelChange(action) {
  const chat = yield select(selectChatDomain);
  const currentChannel = chat.get('currentChannel');
  const nextChannel = getTrueChannel(action.channel);
  if (currentChannel !== nextChannel) {
    yield put(disconnectChat(currentChannel));
    yield put(connectChat(nextChannel));
  }
}

function* handleDirectchatSend(action) {
  yield put(addDirectchatMessage({ data: action.data, chat: action.data.to }));
}

function* handleDirectchatReceive(action) {
  yield put(
    addDirectchatMessage({ data: action.data, chat: action.data.from.userId })
  );
}

function* fetchAllMinichats(action) {
  const chatroomId = yield call(getMinichatId, action.channel);
  if (!chatroomId) {
    yield put({
      type: INIT_MINICHAT,
      data: {
        allChatmessages: {
          edges: [],
          pageInfo: {
            startCursor: null,
            hasPreviousPage: false,
          },
        },
      },
    });
    return;
  }

  const data = yield call(
    gqlQuery,
    { text: chatmessageQuery },
    { chatroom: chatroomId }
  );
  yield put({ type: INIT_MINICHAT, ...data });
}

function* fetchMoreMinichats() {
  const chat = yield select(selectChatDomain);
  const data = yield call(
    gqlQuery,
    { text: chatmessageMoreQuery },
    { chatroom: chat.get('currentChannel'), before: chat.get('startCursor') }
  );
  yield put({ type: MORE_MINICHAT, ...data });
}

function* fetchMinichatUpdate(action) {
  const data = yield call(
    gqlQuery,
    { text: chatmessageUpdateQuery },
    { id: action.data.id }
  );
  yield put({ type: ADD_CHATMESSAGE, data });
}

function* getMinichatId(name) {
  const chat = yield select(selectChatDomain);
  const channelIds = chat.get('channelIds');
  if (name in channelIds) {
    return channelIds[name];
  }

  const data = yield call(gqlQuery, { text: chatmessageIdQuery }, { name });
  const id =
    data.data.allChatrooms.edges[0] && data.data.allChatrooms.edges[0].node.id;
  yield put({ type: GOTID_MINICHAT, id, name });
  return id;
}

function* handleOpenChat(action) {
  yield put(toggleChat('chat'));
  yield put(changeChannel(action.channel));
}

// Individual exports for testing
export default function* defaultSaga() {
  yield [
    takeLatest('@@router/LOCATION_CHANGE', onChangeLocation),
    takeEvery(TOGGLE_MINICHAT, handleToggleChat),
    takeEvery(TOGGLE_MEMO, handleToggleMemo),
    takeEvery(SEND_DIRECTCHAT, handleDirectchatSend),
    takeEvery(DIRECTCHAT_RECEIVED, handleDirectchatReceive),
    takeLatest(CHANGE_CHANNEL, handleChannelChange),
    takeLatest(CHATROOM_CONNECT, fetchAllMinichats),
    takeLatest(MINICHAT_MORE, fetchMoreMinichats),
    takeEvery(CHATMESSAGE_ADDED, fetchMinichatUpdate),
    takeLatest(OPEN_CHAT, handleOpenChat),
  ];
}
