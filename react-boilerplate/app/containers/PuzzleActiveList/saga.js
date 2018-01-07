import {
  take,
  call,
  put,
  select,
  takeLatest,
  takeEvery
} from "redux-saga/effects";
import { gqlQuery } from "Environment";

import {
  unsolvedListQueryStandalone,
  unsolvedListElementQueryStandalone,
  unsolvedListSubscribeQueryStandalone,
  PUZZLE_ADDED,
  PUZZLE_UPDATED,
  LOAD_ALL_PUZZLES,
  INIT_PUZZLE_LIST,
  ADD_PUZZLE,
  UPDATE_PUZZLE
} from "./constants";

function* fetchAllPuzzles(action) {
  try {
    const data = yield call(gqlQuery, { text: unsolvedListQueryStandalone });
    yield put({ type: INIT_PUZZLE_LIST, ...data });
  } catch (e) {
    console.log(e);
  }
}

function* fetchPuzzleUpdate(action) {
  const data = yield call(
    gqlQuery,
    { text: unsolvedListSubscribeQueryStandalone },
    { ...action.data }
  );
  yield put({ type: UPDATE_PUZZLE, ...data });
}

function* fetchPuzzleAdd(action) {
  const data = yield call(
    gqlQuery,
    { text: unsolvedListElementQueryStandalone },
    { ...action.data }
  );
  console.log(data)
  yield put({ type: ADD_PUZZLE, ...data });
}

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield [
    takeLatest(LOAD_ALL_PUZZLES, fetchAllPuzzles),
    takeEvery(PUZZLE_UPDATED, fetchPuzzleUpdate),
    takeEvery(PUZZLE_ADDED, fetchPuzzleAdd)
  ];
}
