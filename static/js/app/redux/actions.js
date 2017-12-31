export const SET_CURRENT_USER = "SET_CURRENT_USER";

const WS_CONNECT = "WS_CONNECT";
const WS_DISCONNECT = "WS_DISCONNECT";

export const WS = {
  WS_CONNECT: WS_CONNECT,
  WS_DISCONNECT: WS_DISCONNECT
};

const PUZZLE_CONNECT = "PUZZLE_CONNECT";
const PUZZLE_DISCONNECT = "PUZZLE_DISCONNECT";
const VIEWER_CONNECT = "VIEWER_CONNECT";
const VIEWER_DISCONNECT = "VIEWER_DISCONNECT";
const ADD_PUZZLE = "ADD_PUZZLE";
const UPDATE_PUZZLE = "UPDATE_PUZZLE";

export const INTERNAL_ACTIONS = {
  PUZZLE_CONNECT: PUZZLE_CONNECT,
  PUZZLE_DISCONNECT: PUZZLE_DISCONNECT,
  VIEWER_CONNECT: VIEWER_CONNECT,
  VIEWER_DISCONNECT: VIEWER_DISCONNECT,
  ADD_PUZZLE: ADD_PUZZLE,
  UPDATE_PUZZLE: UPDATE_PUZZLE
};

const UPDATE_ONLINE_VIEWER_COUNT = "UPDATE_ONLINE_VIEWER_COUNT";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_ONLINE_USER = "REMOVE_ONLINE_USER";
const PREPEND_PUZZLE_LIST = "PREPEND_PUZZLE_LIST";
const UPDATE_PUZZLE_LIST = "UPDATE_PUZZLE_LIST";
const INIT_PUZZLE_LIST = "INIT_PUZZLE_LIST";

export const EXTERNAL_ACTIONS = {
  UPDATE_ONLINE_VIEWER_COUNT: UPDATE_ONLINE_VIEWER_COUNT,
  ADD_ONLINE_USER: ADD_ONLINE_USER,
  REMOVE_ONLINE_USER: REMOVE_ONLINE_USER,
  INIT_PUZZLE_LIST: INIT_PUZZLE_LIST,
  PREPEND_PUZZLE_LIST: PREPEND_PUZZLE_LIST,
  UPDATE_PUZZLE_LIST: UPDATE_PUZZLE_LIST
};

export const connectStream = stream => {
  switch (stream) {
    case "viewer":
      return {
        type: VIEWER_CONNECT,
        stream: stream
      };
    case "puzzleList":
      return {
        type: PUZZLE_CONNECT,
        stream: stream
      };
    default:
      return {
        type: "SKELETON"
      };
  }
};

export const disconnectStream = stream => {
  switch (stream) {
    case "viewer":
      return {
        type: VIEWER_DISCONNECT,
        stream: stream
      };
    case "puzzleList":
      return {
        type: PUZZLE_DISCONNECT,
        stream: stream
      };
    default:
      return {
        type: "SKELETON"
      };
  }
};

export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  currentUser: user
});

export const addPuzzle = (puzzleId) => ({
  type: ADD_PUZZLE,
  stream: "puzzleList",
  puzzleId
});

export const updatePuzzle = (puzzleId) => ({
  type: UPDATE_PUZZLE,
  stream: "puzzleList",
  puzzleId
});
