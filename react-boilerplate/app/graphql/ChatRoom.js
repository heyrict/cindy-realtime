import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const ChatRoom = gql`
  fragment ChatRoom on ChatRoomNode {
    id
    name
    description
    private
    created
    user {
      ...UserLabel_user
    }
  }
  ${UserLabel}
`;

export default ChatRoom;
