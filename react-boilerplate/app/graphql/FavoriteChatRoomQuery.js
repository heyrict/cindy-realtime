import gql from 'graphql-tag';
import ChatRoom from './ChatRoom';

const FavoriteChatRoomQuery = gql`
  query FavoriteChatRoomQuery($userId: ID!) {
    allFavoriteChatrooms(user: $userId) {
      edges {
        node {
          chatroom {
            ...ChatRoom
          }
        }
      }
    }
  }
  ${ChatRoom}
`;

export default FavoriteChatRoomQuery;
