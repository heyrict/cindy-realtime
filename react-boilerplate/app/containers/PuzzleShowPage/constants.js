/*
 *
 * PuzzleShowPage constants
 *
 */

export const PUZZLE_SHOWN = 'app/containers/PuzzleShowPage/PUZZLE_SHOWN';

export const INIT_PUZZLE_SHOW = 'app/containers/PuzzleShowPage/INIT_PUZZLE_SHOW';

// {{{ const puzzleShowQuery
export const puzzleShowQuery = `
  query($puzzleId: Int!) {
    puzzleShownUnion(puzzle: $puzzleId) {
      edges {
        node {
          ... on DialogueNode {
            id
            user {
              id
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
  }
`;
// }}}
