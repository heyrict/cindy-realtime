import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const PuzzleList = gql`
  query PuzzleListInitQuery(
    $orderBy: [String]
    $offset: Int
    $limit: Int
    $status: Float
    $status__gt: Float
    $user: ID
  ) {
    allPuzzles(
      offset: $offset
      limit: $limit
      orderBy: $orderBy
      status: $status
      status_Gt: $status__gt
      user: $user
    )
      @connection(
        key: "PuzzleNode_allPuzzles"
        filter: ["orderBy", "user", "offset"]
      ) {
      edges {
        node {
          id
          ...PuzzlePanel_node
        }
      }
      totalCount
    }
  }
  ${PuzzlePanel}
`;

export default PuzzleList;
