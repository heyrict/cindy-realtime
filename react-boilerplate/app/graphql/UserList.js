import { graphql } from 'react-relay';

const UserList = graphql`
  fragment UserList_list on Query
    @argumentDefinitions(
      count: { type: Int, defaultValue: 3 }
      cursor: { type: String }
      orderBy: { type: "[String]", defaultValue: "-id" }
    ) {
    allUsers(first: $count, after: $cursor, orderBy: $orderBy)
      @connection(key: "UserNode_allUsers") {
      edges {
        node {
          id
          ...UserPanel_node
        }
      }
    }
  }
`;

export default UserList;
