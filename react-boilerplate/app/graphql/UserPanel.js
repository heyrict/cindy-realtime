import { graphql } from 'react-relay';

const UserPanel = graphql`
  fragment UserPanel_node on UserNode {
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

export default UserPanel;
