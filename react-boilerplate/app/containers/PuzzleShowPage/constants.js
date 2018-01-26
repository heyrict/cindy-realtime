/*
 *
 * PuzzleShowPage constants
 *
 */

import { componentsUserFragment } from 'containers/PuzzleActiveList/constants';

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

// {{{ const componentsDialogueFragment
export const componentsDialogueFragment = `
  fragment components_dialogue on DialogueNode {
    id
    user {
      ...components_user
    }
    good
    true
    question
    answer
    created
    answeredtime
  }
  ${componentsUserFragment}
`;
// }}}

// {{{ const dialogueQuery
export const dialogueQuery = `
  query($id: ID!) {
    dialogue(id: $id) {
      ...components_dialogue
    }
  }
  ${componentsDialogueFragment}
`;
// }}}

// {{{ const hintQuery
export const hintQuery = `
  query($id: ID!) {
    hint(id: $id) {
      id
      content
      created
    }
  }
`;
// }}}

// {{{ const puzzleShowQuery
export const puzzleShowQuery = `
  query($id: ID!, $userId: ID!) {
    puzzleShowUnion(id: $id) {
      edges {
        node {
          ... on DialogueNode {
            ...components_dialogue
          }

          ... on HintNode {
            id
            content
            created
          }
        }
      }
    }
    puzzle(id: $id) {
      id
      title
      yami
      genre
      status
      user {
        ...components_user
      }
      content
      solution
      memo
      created
      modified
    }
    allComments(puzzle: $id, user: $userId) {
      edges {
        node {
          id
          content
          spoiler
        }
      }
    }
    allStars(puzzle: $id, user: $userId) {
      edges {
        node {
          id
          value
        }
      }
    }
  }
  ${componentsDialogueFragment}
`;
// }}}

// {{{ const puzzleUpdateQuery
export const puzzleUpdateQuery = `
  query($id: ID!) {
    puzzle(id: $id) {
      title
      yami
      status
      solution
      memo
    }
  }
`;
// }}}
