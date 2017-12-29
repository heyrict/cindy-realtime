import actions from "./actions"

const socketMiddleware = () => {
  var socket = null

  const onOpen = (ws, store, token) => evt => {
    store.dispatch(actions.connected())
  }

  const onClose = (ws, store) => evt => {
    store.dispatch(actions.disconnected())
  }

  const onMessage = (ws, store) => evt => {
    var msg = JSON.parse(evt.data)
    switch(msg.type) {
      default:
        console.log("MESSAGE NOT HANDLED:", msg)
        break;
    }
  }
  
  return store => next => action => {
    switch(action.type) {
      case "CONNECT":
        if(socket != null) {
          socket.close()
        }
        store.dispatch(actions.connecting())

        socket = new WebSocket(action.url)
        socket.onmessage = onMessage(socket, store)
        socket.onclose = onClose(socket, store)
        socket.onopen = onOpen(socket, store, action.token)
        break
      case "DISCONNECT":
        if (socket != null) {
          socket.close();
        }
        socket = null
        store.dispatch(actions.disconnected())
        break
      default:
        return next(action);
    }
  }
}

export default socketMiddleware;

