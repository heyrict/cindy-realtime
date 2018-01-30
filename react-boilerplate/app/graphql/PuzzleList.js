import { graphql } from 'react-relay';

const PuzzleList = graphql`
  fragment PuzzleList_list on Query
    @argumentDefinitions(
      count: { type: Int, defaultValue: 3 }
      cursor: { type: String }
      orderBy: { type: "[String]", defaultValue: "-id" }
      status: { type: Float, defaultValue: null }
      status__gt: { type: Float, defaultValue: null }
      user: { type: ID, defaultValue: null }
    ) {
    allPuzzles(
      first: $count
      after: $cursor
      orderBy: $orderBy
      status: $status
      status_Gt: $status__gt
      user: $user
    ) @connection(key: "PuzzleNode_allPuzzles") {
      edges {
        node {
          id
          ...PuzzlePanel_node
        }
      }
    }
  }
`;

export default PuzzleList;
