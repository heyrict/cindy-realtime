import gql from 'graphql-tag';

const DeleteFavoriteChatRoomMutation = gql`
  mutation DeleteFavoriteChatRoomMutation(
    $input: DeleteFavoriteChatRoomInput!
  ) {
    deleteFavoriteChatroom(input: $input) {
      clientMutationId
    }
  }
`;

export default DeleteFavoriteChatRoomMutation;
