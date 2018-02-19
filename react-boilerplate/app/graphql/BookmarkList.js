import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const BookmarkListInitQuery = gql`
  query BookmarkListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $user: ID
  ) {
    allBookmarks(first: $count, after: $cursor, orderBy: $orderBy, user: $user)
      @connection(
        key: "BookmarkNode_allBookmarks"
        filter: ["orderBy", "user"]
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
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${PuzzlePanel}
`;

export default BookmarkListInitQuery;
