import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { gqlQuery } from 'Environment';
import { to_global_id as g } from 'common';

import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import { makeSelectLocation } from 'containers/App/selectors';
import { UPDATE_ANSWER } from 'containers/Dialogue/constants';
import { PUZZLE_UPDATED } from 'containers/PuzzleActiveList/constants';
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
  UPDATE_PUZZLE,
  puzzleShowQuery,
  puzzleShowNonauthQuery,
  puzzleUpdateQuery,
  dialogueQuery,
  hintQuery,
} from './constants';
import { selectPuzzleShowPageDomain } from './selectors';

function* fetchPuzzleBody(action) {
  const usernavbar = yield select(selectUserNavbarDomain);
  const currentUser = usernavbar.get('user');
  const currentUserId = currentUser.get('userId');
  const data = yield call(
    gqlQuery,
    { text: currentUserId ? puzzleShowQuery : puzzleShowNonauthQuery },
    {
      id: g('PuzzleNode', action.data.puzzleId),
      userId: currentUserId ? g('UserNode', currentUserId) : null,
    },
  );
  yield put({ type: INIT_PUZZLE_SHOW, ...data });
}

function* fetchDialogue(action) {
  const location = yield select(makeSelectLocation());
  const matches = location.pathname.match(/\/puzzle\/show\/([0-9]+)/);
  if (matches !== null && matches[1] === String(action.data.puzzleId)) {
    const data = yield call(
      gqlQuery,
      { text: dialogueQuery },
      { id: action.data.id },
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
}

function* fetchHint(action) {
  const data = yield call(
    gqlQuery,
    { text: hintQuery },
    { id: action.data.id },
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

function* fetchUpdatedPuzzle(action) {
  const puzzle = yield select(selectPuzzleShowPageDomain);
  const puzzleId = puzzle.get('puzzle').id;
  if (puzzleId === action.data.id) {
    const data = yield call(
      gqlQuery,
      { text: puzzleUpdateQuery },
      { id: action.data.id },
    );
    yield put({ type: UPDATE_PUZZLE, ...data });
  }
}

// Individual exports for testing
export default function* defaultSaga() {
  yield [
    takeLatest(PUZZLE_SHOWN, fetchPuzzleBody),
    takeLatest(PUZZLE_UPDATED, fetchUpdatedPuzzle),
    takeEvery([DIALOGUE_ADDED, DIALOGUE_UPDATED], fetchDialogue),
    takeEvery([HINT_ADDED, HINT_UPDATED], fetchHint),
  ];
}
