import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const StarList = gql`
  query StarList($count: Int, $cursor: String, $orderBy: [String], $user: ID) {
    allStars(first: $count, after: $cursor, orderBy: $orderBy, user: $user)
      @connection(key: "StarNode_allStars", filter: ["orderBy", "user"]) {
      edges {
        node {
          id
          value
          puzzle {
            ...PuzzlePanel_node
          }
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

export default StarList;
