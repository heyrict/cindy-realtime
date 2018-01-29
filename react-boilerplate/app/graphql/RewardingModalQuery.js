import { graphql } from 'react-relay';

const RewardingModalQuery = graphql`
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
`;

export default RewardingModalQuery;
