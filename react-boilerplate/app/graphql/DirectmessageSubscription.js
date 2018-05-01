import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const DirectmessageSubscription = gql`
  subscription DirectmessageSubscription($userId: ID) {
    directmessageSub(receiver: $userId) {
      id
      content
      created
      sender {
        ...UserLabel_user
      }
      receiver {
        ...UserLabel_user
      }
    }
  }
  ${UserLabel}
`;

export default DirectmessageSubscription;
