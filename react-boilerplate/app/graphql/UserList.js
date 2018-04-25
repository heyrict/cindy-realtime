import gql from 'graphql-tag';
import UserLabel from './UserLabel';

export const UserList = gql`
  query UserListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $nickname__contains: String
  ) {
    allUsers(
      first: $count
      after: $cursor
      orderBy: $orderBy
      nickname_Contains: $nickname__contains
    )
      @connection(
        key: "UserNode_allUsers"
        filter: ["orderBy", "nickname_Contains"]
      ) {
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
