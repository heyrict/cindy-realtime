import { put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { toggleChat, changeChannel } from './actions';
import {
  TOGGLE_MINICHAT,
  OPEN_MINICHAT,
  CLOSE_MINICHAT,
  TOGGLE_MEMO,
  OPEN_MEMO,
  CLOSE_MEMO,
  OPEN_CHAT,
  ADD_FAVCHAN,
  REMOVE_FAVCHAN,
} from './constants';
import { selectChatDomain } from './selectors';

function* onChangeLocation() {
  const width = window.innerWidth || document.documentElement.clientWidth;

  if (width <= 720) {
    yield put({ type: CLOSE_MINICHAT });
  }
}

function* handleToggleChat(action) {
  const chat = yield select(selectChatDomain);
  const chatOpen = chat.get('open');
  if (chatOpen === 'chat' && action.open !== 'chat') {
    yield put({ type: CLOSE_MINICHAT });
  } else if (chatOpen !== 'chat' && action.open !== null) {
    yield put({ type: OPEN_MINICHAT });
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

function* handleOpenChat(action) {
  yield put(toggleChat('chat'));
  yield put(changeChannel(action.channel));
}

function* syncFavChannels() {
  const chat = yield select(selectChatDomain);
  window.django.user_favChannels = chat.get('favChannels');
}

// Individual exports for testing
export default function* defaultSaga() {
  yield [
    takeLatest('@@router/LOCATION_CHANGE', onChangeLocation),
    takeEvery(TOGGLE_MINICHAT, handleToggleChat),
    takeEvery(TOGGLE_MEMO, handleToggleMemo),
    takeLatest(OPEN_CHAT, handleOpenChat),
    takeEvery([ADD_FAVCHAN, REMOVE_FAVCHAN], syncFavChannels),
  ];
}
