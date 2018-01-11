/*
 *
 * PuzzleActiveList constants
 *
 */

export const PUZZLE_ADDED = 'ws/PUZZLE_ADDED';
export const PUZZLE_UPDATED = 'ws/PUZZLE_UPDATED';

export const LOAD_ALL_PUZZLES =
  'app/containers/PuzzleActiveList/LOAD_ALL_PUZZLES';
export const INIT_PUZZLE_LIST =
  'app/containers/PuzzleActiveList/INIT_PUZZLE_LIST';
export const ADD_PUZZLE = 'app/containers/PuzzleActiveList/ADD_PUZZLE';
export const UPDATE_PUZZLE = 'app/containers/PuzzleActiveList/UPDATE_PUZZLE';

// {{{ const unsolvedListQuery
const unsolvedListQuery = `
  query {
    allPuzzles(status: 0, orderBy: "-modified") {
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
// {{{ const unsolvedListElementQuery
export const unsolvedListElementQuery = `
  query($id: ID!) {
    puzzle(id: $id) {
      id
      ...PuzzleList_node
    }
  }
`;
// }}}
// {{{ const unsolvedListSubscribeQuery
export const unsolvedListSubscribeQuery = `
  query($id: ID!) {
    puzzle(id: $id) {
      id
      ...PuzzleList_subnode
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
    user {
      ...components_user
    }
  }
`;
// }}}
// {{{ const puzzleListSubscribeFragment
const puzzleListSubscribeFragment = `
  fragment PuzzleList_subnode on PuzzleNode {
    id
    status
    quesCount
    uaquesCount
  }
`;
// }}}
// {{{ const componentsUserFragment
export const componentsUserFragment = `
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
export const unsolvedListSubscribeQueryStandalone =
  unsolvedListSubscribeQuery + puzzleListSubscribeFragment;
export const unsolvedListElementQueryStandalone =
  unsolvedListElementQuery + puzzleListNodeFragment + componentsUserFragment;
