export const SET_CURRENT_USER = "SET_CURRENT_USER";

const SOUP_CONNECT = "SOUP_CONNECT";
const SOUP_DISCONNECT = "SOUP_DISCONNECT";
const VIEWER_CONNECT = "VIEWER_CONNECT";
const VIEWER_DISCONNECT = "VIEWER_DISCONNECT";
const ADD_SOUP = "ADD_SOUP";
const UPDATE_SOUP = "UPDATE_SOUP";

export const INTERNAL_ACTIONS = {
  SOUP_CONNECT: SOUP_CONNECT,
  SOUP_DISCONNECT: SOUP_DISCONNECT,
  VIEWER_CONNECT: VIEWER_CONNECT,
  VIEWER_DISCONNECT: VIEWER_DISCONNECT,
  ADD_SOUP: ADD_SOUP,
  UPDATE_SOUP: UPDATE_SOUP,
};

const UPDATE_ONLINE_VIEWER_COUNT = "UPDATE_ONLINE_VIEWER_COUNT";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_ONLINE_USER = "REMOVE_ONLINE_USER";
const PREPEND_SOUP_LIST = "PREPEND_SOUP_LIST";
const UPDATE_SOUP_LIST = "UPDATE_SOUP_LIST";
const INIT_SOUP_LIST = "INIT_SOUP_LIST";

export const EXTERNAL_ACTIONS = {
  UPDATE_ONLINE_VIEWER_COUNT: UPDATE_ONLINE_VIEWER_COUNT,
  ADD_ONLINE_USER: ADD_ONLINE_USER,
  REMOVE_ONLINE_USER: REMOVE_ONLINE_USER,
  INIT_SOUP_LIST: INIT_SOUP_LIST,
  PREPEND_SOUP_LIST: PREPEND_SOUP_LIST,
  UPDATE_SOUP_LIST: UPDATE_SOUP_LIST
};

export const connectStream = stream => {
  switch(stream) {
    case "viewer":
      return {
        type: VIEWER_CONNECT,
        stream: stream
      }
    case "soupList":
      return {
        type: SOUP_CONNECT,
        stream: stream
      }
    default:
      return {
        type: "SKELETON"
      }
  }
}

export const disconnectStream = stream => {
  switch(stream) {
    case "viewer":
      return {
        type: VIEWER_DISCONNECT,
        stream: stream
      }
    case "soupList":
      return {
        type: SOUP_DISCONNECT,
        stream: stream
      }
    default:
      return {
        type: "SKELETON"
      }
  }
}

export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  currentUser: user
});

export const addSoup = () => ({
  type: ADD_SOUP
});

export const updateSoup = () => ({
  type: UPDATE_SOUP
});
