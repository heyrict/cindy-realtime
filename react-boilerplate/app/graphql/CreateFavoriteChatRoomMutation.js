import gql from 'graphql-tag';
import ChatRoom from './ChatRoom';

const CreateFavoriteChatRoomMutation = gql`
  mutation CreateFavoriteChatRoomMutation(
    $input: CreateFavoriteChatRoomInput!
  ) {
    createFavoriteChatroom(input: $input) {
      favchatroom {
        chatroom {
          ...ChatRoom
        }
      }
    }
  }
  ${ChatRoom}
`;

export default CreateFavoriteChatRoomMutation;
