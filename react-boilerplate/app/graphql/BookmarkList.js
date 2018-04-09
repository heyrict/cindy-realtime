import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const BookmarkListInitQuery = gql`
  query BookmarkListInitQuery(
    $limit: Int
    $offset: Int
    $orderBy: [String]
    $user: ID
  ) {
    allBookmarks(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      user: $user
    )
      @connection(
        key: "BookmarkNode_allBookmarks"
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

export default BookmarkListInitQuery;
