import gql from 'graphql-tag';

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
`;

export default RewardingModalQuery;
