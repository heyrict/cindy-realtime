import gql from 'graphql-tag';

export const CreateChatmessageMutation = gql`
  mutation CreateChatmessageMutation($input: CreateChatMessageInput!) {
    createChatmessage(input: $input) {
      chatmessage {
        id
        created
      }
    }
  }
`;

export default CreateChatmessageMutation;
