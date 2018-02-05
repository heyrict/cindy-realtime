import { graphql } from 'react-relay';

export const CreateChatmessageMutation = graphql`
  mutation CreateChatmessageMutation($input: CreateChatMessageInput!) {
    createChatmessage(input: $input) {
      clientMutationId
    }
  }
`;

export default CreateChatmessageMutation;
