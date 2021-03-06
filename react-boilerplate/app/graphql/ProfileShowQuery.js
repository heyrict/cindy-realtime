import gql from 'graphql-tag';

export const ProfileShowQuery = gql`
  query ProfileShowQuery($id: ID!) {
    user(id: $id) {
      id
      nickname
      puzzleCount
      quesCount
      goodQuesCount
      trueQuesCount
      commentCount
      rcommentCount
      rstarCount
      rstarSum
      currentAward {
        id
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
      hideBookmark
    }
  }
`;

export default ProfileShowQuery;
