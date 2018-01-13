/*
 *
 * PuzzleShowPage constants
 *
 */

import { componentsUserFragment } from 'containers/PuzzleActiveList/constants';

export const PUZZLE_SHOWN = 'app/containers/PuzzleShowPage/PUZZLE_SHOWN';

export const INIT_PUZZLE_SHOW =
  'app/containers/PuzzleShowPage/INIT_PUZZLE_SHOW';

export const QUESTION_ADDED = 'app/containers/PuzzleShowPage/QUESTION_ADDED';

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
