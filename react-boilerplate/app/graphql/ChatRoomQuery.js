import gql from 'graphql-tag';
import ChatRoom from './ChatRoom';

const ChatRoomQuery = gql`
  query ChatRoomQuery($chatroomName: String!) {
    allChatrooms(name: $chatroomName) {
      edges {
        node {
          ...ChatRoom
        }
      }
    }
  }
  ${ChatRoom}
`;

export default ChatRoomQuery;
