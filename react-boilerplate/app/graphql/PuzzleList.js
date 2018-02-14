import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const PuzzleList = gql`
  query PuzzleListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $status: Float
    $status__gt: Float
    $user: ID
  ) {
    allPuzzles(
      first: $count
      after: $cursor
      orderBy: $orderBy
      status: $status
      status_Gt: $status__gt
      user: $user
    ) @connection(key: "PuzzleNode_allPuzzles", filter: ["orderBy", "user"]) {
      edges {
        node {
          id
          ...PuzzlePanel_node
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${PuzzlePanel}
`;

export default PuzzleList;
