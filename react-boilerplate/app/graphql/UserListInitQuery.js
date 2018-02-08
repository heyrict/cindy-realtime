import { graphql } from 'react-relay';

export const UserListInitQuery = graphql`
  query UserListInitQuery($count: Int, $cursor: String, $orderBy: [String]) {
    ...UserList_list
      @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
  }
`;

export default UserListInitQuery;
