import gql from 'graphql-tag';

const UserLabel = gql`
  fragment UserLabel_user on UserNode {
    id
    rowid
    nickname
    dateJoined
    currentAward {
      id
      created
      award {
        id
        name
        description
      }
    }
  }
`;

export default UserLabel;
