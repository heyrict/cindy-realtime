import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const DirectmessageQuery = gql`
  query DirectmessageSessionQuery(
    $userId: ID
    $last: Int
    $before: String
    $orderBy: [String]
  ) {
    allDirectmessages(
      userId: $userId
      last: $last
      before: $before
      orderBy: $orderBy
    )
      @connection(
        key: "DirectMessageNode_DirectmessageQuery"
        filter: ["userId"]
      ) {
      pageInfo {
        startCursor
        hasPreviousPage
      }
      edges {
        node {
          id
          sender {
            ...UserLabel_user
          }
          receiver {
            ...UserLabel_user
          }
          content
          created
        }
      }
    }
  }
  ${UserLabel}
`;

export default DirectmessageQuery;
