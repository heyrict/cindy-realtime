import { call, race, take, put, takeEvery, all, select } from "redux-saga/effects";
import { WebSocketBridge } from "django-channels";
import { eventChannel, delay } from "redux-saga";

import { WS_CONNECT, WS_DISCONNECT } from "./constants"
import { INTERNAL_ACTIONS } from "./constants"

function* handleInternalAction(socket, action) {
  console.log("INTERNAL:", action);

  for (let i = 1; i <= 10; ++i) {
    try {
      const { stream = "viewer", ...payload } = action;
      socket.stream(stream).send(payload);
      return;
    } catch (e) {
      console.log("Socket not connected. Retry..." + i);
      if (socket.socket.readyState == 0) yield call(delay, 1000);
    }
  }
}

function* internalListener(socket) {
  yield takeEvery(INTERNAL_ACTIONS, handleInternalAction, socket);
}

function* externalListener(channel) {
  while (true) {
    const action = yield take(channel);
    console.log("EXTERNAL:", action);
    yield put(action);
  }
}

function websocketWatch(socket) {
  return eventChannel(emitter => {
    socket.listen("/ws/");
    socket.socket.onmessage = ({ data }) => {
      data = JSON.parse(data);
      const { stream, payload } = data;
      console.log("watch:", data);
      //dispatch(data);
      if (stream) emitter(payload);
      else emitter(data);
    };

    return () => {
      socket.close();
    };
  });
}

export default function* websocketSagas() {
  while (true) {
    const data = yield take(WS_CONNECT);
    const socket = new WebSocketBridge();
    socket.connect("/ws/");
    const socketChannel = yield call(websocketWatch, socket);
    //dispatch({ type: "WS_CONNECTED" });

    const { cancel } = yield race({
      task: [
        call(externalListener, socketChannel),
        call(internalListener, socket)
      ],
      cancel: take(WS_DISCONNECT)
    });

    if (cancel) {
      socketChannel.close();
    }
  }
}
