/*
 *
 * PuzzleShowPage constants
 *
 */
import { from_global_id as f } from 'common';

export const PUZZLE_SHOWN = 'app/containers/PuzzleShowPage/PUZZLE_SHOWN';
export const PUZZLE_HID = 'app/containers/PuzzleShowPage/PUZZLE_HID';

export const DIALOGUE_ADDED = 'ws/DIALOGUE_ADDED';
export const DIALOGUE_UPDATED = 'ws/DIALOGUE_UPDATED';

export const HINT_ADDED = 'ws/HINT_ADDED';
export const HINT_UPDATED = 'ws/HINT_UPDATED';

export const INIT_PUZZLE_SHOW =
  'app/containers/PuzzleShowPage/INIT_PUZZLE_SHOW';
export const UPDATE_PUZZLE = 'app/containers/PuzzleShowPage/UPDATE_PUZZLE';

export const ADD_QUESTION = 'app/containers/PuzzleShowPage/ADD_QUESTION';

export const ADD_HINT = 'app/containers/PuzzleShowPage/ADD_HINT';
export const UPDATE_HINT = 'app/containers/PuzzleShowPage/UPDATE_HINT';

export const dialogueSlicer = ({
  numItems = 50,
  puzzleShowUnion: D,
  userFilter: F,
  page,
}) => {
  let index = 0;
  const slices = [];
  const participants = {};
  const filteredEdges = [];
  D.edges.forEach((edge) => {
    if (f(edge.node.id)[0] === 'DialogueNode') {
      index += 1;

      if (edge.node.user.id in participants) {
        participants[edge.node.user.id].count += 1;
      } else {
        participants[edge.node.user.id] = {
          user: edge.node.user,
          count: 1,
          trueansw: false,
        };
      }
      if (edge.node.true) {
        participants[edge.node.user.id].trueansw = true;
      }

      if (F.indexOf(edge.node.user.id) === -1) {
        filteredEdges.push({ ...edge, index });
      }
    } else {
      filteredEdges.push(edge);
    }

    if (filteredEdges.length !== 0 && filteredEdges.length % numItems === 0) {
      slices.push(index);
    }
  });

  slices.push(index);
  return {
    slices,
    edges: filteredEdges.slice(page * numItems, (page + 1) * numItems),
    participants,
  };
};
