import { graphql } from 'react-relay';

export const ProfileShowQuery = graphql`
  query ProfileShowQuery($id: ID!) {
    user(id: $id) {
      nickname
      currentAward {
        id
        created
        award {
          id
          name
          description
        }
      }
      userawardSet {
        edges {
          node {
            id
            created
            award {
              id
              name
              description
            }
          }
        }
      }
      dateJoined
      lastLogin
      profile
    }
  }
`;

export default ProfileShowQuery;
