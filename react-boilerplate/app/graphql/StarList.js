import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const StarList = gql`
  query StarList($offset: Int, $limit: Int, $orderBy: [String], $user: ID) {
    allStars(offset: $offset, limit: $limit, orderBy: $orderBy, user: $user)
      @connection(
        key: "StarNode_allStars"
        filter: ["orderBy", "user", "offset"]
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
