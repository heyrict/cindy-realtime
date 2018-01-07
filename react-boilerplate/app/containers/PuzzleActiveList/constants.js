/*
 *
 * PuzzleActiveList constants
 *
 */

export const ADD_PUZZLE = "ws/ADD_PUZZLE";
export const UPDATE_PUZZLE = "ws/UPDATE_PUZZLE";

export const LOAD_ALL_PUZZLES =
  "app/containers/PuzzleActiveList/LOAD_ALL_PUZZLES";
export const INIT_PUZZLE_LIST =
  "app/containers/PuzzleActiveList/INIT_PUZZLE_LIST";

// {{{ const unsolvedListQuery
const unsolvedListQuery = `
  query {
    allPuzzles (status: 0, orderBy: "-modified") {
      edges {
        node {
          id
          ...PuzzleList_node
        }
      }
    }
  }
`;
// }}}
// {{{ const puzzleListNodeFragment
const puzzleListNodeFragment = `
  fragment PuzzleList_node on PuzzleNode {
    id
    rowid
    genre
    title
    status
    created
    quesCount
    uaquesCount
    starSet {
      edges {
        node {
          value
        }
      }
    }
    user {
      ...components_user
    }
  }
`;
// }}}
// {{{ const componentsUserFragment
const componentsUserFragment = `
  fragment components_user on UserNode {
    rowid
    nickname
    currentAward {
      id
      created
      award {
        id
        name
        description
      }
    }
  }
`;
// }}}

export const unsolvedListQueryStandalone =
  unsolvedListQuery + puzzleListNodeFragment + componentsUserFragment;
