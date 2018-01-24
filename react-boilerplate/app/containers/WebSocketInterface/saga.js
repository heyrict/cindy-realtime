/*
 *
 * WebSocketInterface saga
 *
 */

/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars, no-param-reassign */

import { call, race, take, put, takeEvery } from 'redux-saga/effects';
import { eventChannel, delay } from 'redux-saga';

import { WS_CONNECT, WS_DISCONNECT, INTERNAL_ACTIONS } from './constants';

function* handleInternalAction(socket, action) {
  console.log('INTERNAL:', action);
  if (action.delay) yield delay(action.delay);

  for (let i = 1; i <= 10; i += 1) {
    try {
      socket.send(JSON.stringify(action));
      return;
    } catch (e) {
      console.log(`Socket not connected. Retry...${i}`);
      if (socket.readyState === 0) yield call(delay, 1000);
    }
  }
}

function* internalListener(socket) {
  yield takeEvery(INTERNAL_ACTIONS, handleInternalAction, socket);
}

function* externalListener(channel) {
  while (true) {
    const action = yield take(channel);
    console.log('EXTERNAL:', action);
    yield put(action);
  }
}

function websocketWatch(socket) {
  return eventChannel((emitter) => {
    socket.onmessage = (action) => {
      emitter(JSON.parse(action.data));
    };

    return () => {
      socket.close();
    };
  });
}

export default function* websocketSagas() {
  while (true) {
    const data = yield take(WS_CONNECT);
    const socket = new WebSocket(`ws://${window.location.host}/ws/`);
    const socketChannel = yield call(websocketWatch, socket);

    const { cancel } = yield race({
      task: [
        call(externalListener, socketChannel),
        call(internalListener, socket),
      ],
      cancel: take(WS_DISCONNECT),
    });

    if (cancel) {
      socketChannel.close();
    }
  }
}
