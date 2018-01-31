import { graphql } from 'react-relay';

const BookmarkList = graphql`
  fragment BookmarkList_list on Query
    @argumentDefinitions(
      count: { type: Int, defaultValue: 3 }
      cursor: { type: String }
      orderBy: { type: "[String]", defaultValue: "-id" }
      user: { type: ID, defaultValue: null }
    ) {
    allBookmarks(first: $count, after: $cursor, orderBy: $orderBy, user: $user)
      @connection(key: "BookmarkNode_allBookmarks") {
      edges {
        node {
          id
          value
          puzzle {
            ...PuzzlePanel_node
          }
        }
      }
    }
  }
`;

export default BookmarkList;
