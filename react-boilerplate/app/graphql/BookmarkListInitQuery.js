import { graphql } from 'react-relay';

export const BookmarkListInitQuery = graphql`
  query BookmarkListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $user: ID
  ) {
    ...BookmarkList_list
      @arguments(count: $count, cursor: $cursor, orderBy: $orderBy, user: $user)
  }
`;

export default BookmarkListInitQuery;
