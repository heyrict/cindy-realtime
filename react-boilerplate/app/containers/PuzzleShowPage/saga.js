import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { gqlQuery } from 'Environment';
import { to_global_id as g } from 'common';

import { UPDATE_ANSWER } from 'containers/Dialogue/constants';
import {
  PUZZLE_SHOWN,
  INIT_PUZZLE_SHOW,
  HINT_ADDED,
  HINT_UPDATED,
  DIALOGUE_ADDED,
  DIALOGUE_UPDATED,
  ADD_QUESTION,
  ADD_HINT,
  UPDATE_HINT,
  puzzleShowQuery,
  dialogueQuery,
  hintQuery,
} from './constants';

function* fetchPuzzleBody(action) {
  const data = yield call(
    gqlQuery,
    { text: puzzleShowQuery },
    { id: g('PuzzleNode', action.data.puzzleId) }
  );
  yield put({ type: INIT_PUZZLE_SHOW, ...data });
}

function* fetchDialogue(action) {
  const data = yield call(
    gqlQuery,
    { text: dialogueQuery },
    { id: action.data.id }
  );
  switch (action.type) {
    case DIALOGUE_ADDED:
      yield put({ type: ADD_QUESTION, ...data });
      break;
    case DIALOGUE_UPDATED:
      yield put({ type: UPDATE_ANSWER, ...data });
      break;
    default:
  }
}

function* fetchHint(action) {
  const data = yield call(
    gqlQuery,
    { text: hintQuery },
    { id: action.data.id }
  );
  switch (action.type) {
    case HINT_ADDED:
      yield put({ type: ADD_HINT, ...data });
      break;
    case HINT_UPDATED:
      yield put({ type: UPDATE_HINT, ...data });
      break;
    default:
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield [
    takeLatest(PUZZLE_SHOWN, fetchPuzzleBody),
    takeEvery([DIALOGUE_ADDED, DIALOGUE_UPDATED], fetchDialogue),
    takeEvery([HINT_ADDED, HINT_UPDATED], fetchHint),
  ];
}
