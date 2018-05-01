import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const DirectmessageQuery = gql`
  query DirectmessageSessionQuery($userId: ID, $first: Int) {
    allDirectmessages(userId: $userId, limit: $first) {
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
