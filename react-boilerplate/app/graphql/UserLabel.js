import { graphql } from 'react-relay';

const UserLabel = graphql`
  fragment UserLabel_user on UserNode {
    rowid
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
  }
`

export default UserLabel;
