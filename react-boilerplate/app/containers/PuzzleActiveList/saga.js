import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { to_global_id as t } from 'common';
import { gqlQuery } from 'Environment';

import { DIALOGUE_ADDED } from 'containers/PuzzleShowPage/constants';
import {
  unsolvedListQueryStandalone,
  unsolvedListElementQueryStandalone,
  unsolvedListSubscribeQueryStandalone,
  PUZZLE_ADDED,
  PUZZLE_UPDATED,
  LOAD_ALL_PUZZLES,
  INIT_PUZZLE_LIST,
  ADD_PUZZLE,
  UPDATE_PUZZLE,
} from './constants';

function* fetchAllPuzzles() {
  const data = yield call(gqlQuery, { text: unsolvedListQueryStandalone });
  yield put({ type: INIT_PUZZLE_LIST, ...data });
}

function* fetchPuzzleUpdate(action) {
  const data = yield call(
    gqlQuery,
    { text: unsolvedListSubscribeQueryStandalone },
    {
      id:
        action.type === PUZZLE_UPDATED
          ? action.data.id
          : t('PuzzleNode', action.data.puzzleId),
    }
  );
  yield put({ type: UPDATE_PUZZLE, ...data });
}

function* fetchPuzzleAdd(action) {
  const data = yield call(
    gqlQuery,
    { text: unsolvedListElementQueryStandalone },
    { ...action.data }
  );
  yield put({ type: ADD_PUZZLE, ...data });
}

// Individual exports for testing
export default function* defaultSaga() {
  // See example in containers/HomePage/saga.js
  yield [
    takeLatest(LOAD_ALL_PUZZLES, fetchAllPuzzles),
    takeEvery([PUZZLE_UPDATED, DIALOGUE_ADDED], fetchPuzzleUpdate),
    takeEvery(PUZZLE_ADDED, fetchPuzzleAdd),
  ];
}
