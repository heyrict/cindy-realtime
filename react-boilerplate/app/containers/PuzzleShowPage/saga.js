import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { gqlQuery } from 'Environment';
import { to_global_id as g } from 'common';

import { UPDATE_ANSWER } from 'containers/Dialogue/constants';
import {
  PUZZLE_SHOWN,
  INIT_PUZZLE_SHOW,
  DIALOGUE_ADDED,
  DIALOGUE_UPDATED,
  ADD_QUESTION,
  puzzleShowQuery,
  dialogueQuery,
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

// Individual exports for testing
export default function* defaultSaga() {
  yield [
    takeLatest(PUZZLE_SHOWN, fetchPuzzleBody),
    takeEvery([DIALOGUE_ADDED, DIALOGUE_UPDATED], fetchDialogue),
  ];
}
