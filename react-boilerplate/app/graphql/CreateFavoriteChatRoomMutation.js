import { graphql } from 'react-relay';

const CreateFavoriteChatRoomMutation = graphql`
  mutation CreateFavoriteChatRoomMutation(
    $input: CreateFavoriteChatRoomInput!
  ) {
    createFavoriteChatroom(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateFavoriteChatRoomMutation;
