import gql from 'graphql-tag';
import ChatMessage from './ChatMessage';

export const CreateChatmessageMutation = gql`
  mutation CreateChatmessageMutation($input: CreateChatMessageInput!) {
    createChatmessage(input: $input) {
      chatmessage {
        ...ChatMessage
      }
    }
  }
  ${ChatMessage}
`;

export default CreateChatmessageMutation;
