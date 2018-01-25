import { put, select, takeEvery } from 'redux-saga/effects';
import { selectChatDomain } from 'containers/Chat/selectors';

import { ADD_DIRECTCHAT_MESSAGE } from 'containers/Chat/constants';
import { DIRECTCHAT_NOTIFY } from './constants';

function* handleDirectchatNotify(action) {
  const chat = yield select(selectChatDomain);
  if (
    chat.get('open') !== true ||
    chat.get('activeTab') !== 'TAB_DIRECTCHAT' ||
    chat.get('activeDirectChat') !== String(action.chat)
  ) {
    yield put({ ...action, type: DIRECTCHAT_NOTIFY });
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield [takeEvery(ADD_DIRECTCHAT_MESSAGE, handleDirectchatNotify)];
}
