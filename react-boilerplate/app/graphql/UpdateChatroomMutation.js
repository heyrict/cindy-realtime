import gql from 'graphql-tag';

const UpdateChatroomMutation = gql`
  mutation UpdateChatroomMutation($input: UpdateChatRoomInput!) {
    updateChatroom(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateChatroomMutation;
