import { take, call, put, select, takeLatest } from "redux-saga/effects";
import { gqlQuery } from "Environment";

import {
  unsolvedListQueryStandalone,
  INIT_PUZZLE_LIST,
  LOAD_ALL_PUZZLES
} from "./constants";

function* fetchAllPuzzle(action) {
  try {
    const data = yield call(gqlQuery, { text: unsolvedListQueryStandalone });
    yield put({ type: INIT_PUZZLE_LIST, ...data });
  } catch (e) {
    console.log(e);
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(LOAD_ALL_PUZZLES, fetchAllPuzzle);
}
