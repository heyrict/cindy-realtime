import { call, put, takeLatest } from 'redux-saga/effects';
import { gqlQuery } from 'Environment';
import { to_global_id as g } from 'common';

import { PUZZLE_SHOWN, INIT_PUZZLE_SHOW, puzzleShowQuery } from './constants';

function* fetchPuzzleBody(action) {
  const data = yield call(
    gqlQuery,
    { text: puzzleShowQuery },
    { id: g('PuzzleNode', action.data.puzzleId) }
  );
  yield put({ type: INIT_PUZZLE_SHOW, ...data });
}

// Individual exports for testing
export default function* defaultSaga() {
  yield [takeLatest(PUZZLE_SHOWN, fetchPuzzleBody)];
}
