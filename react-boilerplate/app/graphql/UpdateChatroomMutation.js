import { graphql } from 'react-relay';

const UpdateChatroomMutation = graphql`
  mutation UpdateChatroomMutation($input: UpdateChatRoomInput!) {
    updateChatroom(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateChatroomMutation;
