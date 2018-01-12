/*
 *
 * PuzzleShowPage constants
 *
 */

import { componentsUserFragment } from 'containers/PuzzleActiveList/constants';

export const PUZZLE_SHOWN = 'app/containers/PuzzleShowPage/PUZZLE_SHOWN';

export const INIT_PUZZLE_SHOW =
  'app/containers/PuzzleShowPage/INIT_PUZZLE_SHOW';

// {{{ const puzzleShowQuery
export const puzzleShowQuery = `
  query($id: ID!) {
    puzzleShowUnion(id: $id) {
      edges {
        node {
          ... on DialogueNode {
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
  ${componentsUserFragment}
`;
// }}}
