import { graphql } from 'react-relay';

const DeleteFavoriteChatRoomMutation = graphql`
  mutation DeleteFavoriteChatRoomMutation(
    $input: DeleteFavoriteChatRoomInput!
  ) {
    deleteFavoriteChatroom(input: $input) {
      clientMutationId
    }
  }
`;

export default DeleteFavoriteChatRoomMutation;
