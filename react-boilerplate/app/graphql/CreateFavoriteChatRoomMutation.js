import gql from 'graphql-tag';

const CreateFavoriteChatRoomMutation = gql`
  mutation CreateFavoriteChatRoomMutation(
    $input: CreateFavoriteChatRoomInput!
  ) {
    createFavoriteChatroom(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateFavoriteChatRoomMutation;
