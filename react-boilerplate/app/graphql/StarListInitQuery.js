import { graphql } from 'react-relay';

export const StarListInitQuery = graphql`
  query StarListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $user: ID
  ) {
    ...StarList_list
      @arguments(count: $count, cursor: $cursor, orderBy: $orderBy, user: $user)
  }
`;

export default StarListInitQuery;
