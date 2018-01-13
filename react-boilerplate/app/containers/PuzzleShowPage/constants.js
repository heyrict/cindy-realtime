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

export const INIT_PUZZLE_SHOW =
  'app/containers/PuzzleShowPage/INIT_PUZZLE_SHOW';

export const ADD_QUESTION = 'app/containers/PuzzleShowPage/ADD_QUESTION';

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

// {{{ const puzzleShowQuery
export const puzzleShowQuery = `
  query($id: ID!) {
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
  }
  ${componentsDialogueFragment}
`;
// }}}
