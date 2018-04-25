import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const StarList = gql`
  query StarList(
    $offset: Int
    $limit: Int
    $orderBy: [String]
    $user: ID
    $puzzle: ID
  ) {
    allStars(
      offset: $offset
      limit: $limit
      orderBy: $orderBy
      user: $user
      puzzle: $puzzle
    )
      @connection(
        key: "StarNode_allStars"
        filter: ["orderBy", "user", "offset", "puzzle"]
      ) {
      edges {
        node {
          id
          value
          puzzle {
            ...PuzzlePanel_node
          }
        }
      }
      totalCount
    }
  }
  ${PuzzlePanel}
`;

export default StarList;
