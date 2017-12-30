import { INTERNAL_ACTIONS, EXTERNAL_ACTIONS } from "./actions";
import { WebSocketBridge } from "django-channels";
import { call, race, take, put, takeEvery, all } from "redux-saga/effects";
import { eventChannel } from "redux-saga";

import {dispatch} from "../index.jsx";

const { CONNECT, DISCONNECT } = INTERNAL_ACTIONS;

function* internalListener(socket) {
  while (true) {
    const action = yield take(Object.keys(INTERNAL_ACTIONS));
    console.log("INTERNAL:", action);
    socket.stream("viewer").send(action);
  }
}

function* externalListener(socket) {
  while (true) {
    const action = yield take('*');
    console.log("EXTERNAL:", action);
    //yield put(action);
  }
}

function websocketWatch(socket) {
  return eventChannel(emitter => {
    socket.listen("/ws/");
    socket.socket.onmessage = ({ data }) => {
      dispatch(JSON.parse(data));
    };

    return () => {
      socket.close();
    };
  });
}

function* websocketSagas() {
  while (true) {
    const data = yield take(
      Array.concat(Object.keys(INTERNAL_ACTIONS), Object.keys(EXTERNAL_ACTIONS))
    );
    const socket = new WebSocketBridge();
    socket.connect("/ws/");
    const socketChannel = yield call(websocketWatch, socket);

    const { cancel } = yield race({
      task: [
        call(externalListener, socketChannel),
        call(internalListener, socket)
      ],
      cancel: take(DISCONNECT)
    });

    if (cancel) {
      socketChannel.close();
    }
  }
}

export function* rootSaga() {
  yield all([websocketSagas()]);
}
