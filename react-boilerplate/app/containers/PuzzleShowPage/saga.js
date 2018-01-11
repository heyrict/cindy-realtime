import { call, put, takeLatest } from 'redux-saga/effects';
import { gqlQuery } from 'Environment';
import { PUZZLE_SHOWN, INIT_PUZZLE_SHOW, puzzleShowQuery } from './constants';

function* fetchPuzzleBody(action) {
  const data = yield call(
    gqlQuery,
    { text: puzzleShowQuery },
    { ...action.data }
  );
  yield put({ type: INIT_PUZZLE_SHOW, ...data });
}

// Individual exports for testing
export default function* defaultSaga() {
  yield [takeLatest(PUZZLE_SHOWN, fetchPuzzleBody)];
}
