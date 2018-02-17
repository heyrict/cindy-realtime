import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const RewardingModalQuery = gql`
  query RewardingModalQuery($id: ID!) {
    puzzle(id: $id) {
      content
      commentSet {
        edges {
          node {
            id
            user {
              ...UserLabel_user
            }
            content
            spoiler
          }
        }
      }
    }
  }
  ${UserLabel}
`;

export default RewardingModalQuery;
