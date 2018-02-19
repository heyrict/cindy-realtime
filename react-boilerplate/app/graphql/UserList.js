import gql from 'graphql-tag';
import UserLabel from './UserLabel';

export const UserList = gql`
  query UserListInitQuery($count: Int, $cursor: String, $orderBy: [String]) {
    allUsers(first: $count, after: $cursor, orderBy: $orderBy)
      @connection(key: "UserNode_allUsers", filter: ["orderBy"]) {
      edges {
        node {
          id
          ...UserLabel_user
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${UserLabel}
`;

export default UserList;
