import gql from 'graphql-tag';

export const CreateChatmessageMutation = gql`
  mutation CreateChatmessageMutation($input: CreateChatMessageInput!) {
    createChatmessage(input: $input) {
      chatmessage {
        id
        content
        created
        editTimes
        user {
          rowid
          nickname
          currentAward {
            id
            created
            award {
              id
              name
              description
            }
          }
        }
      }
    }
  }
`;

export default CreateChatmessageMutation;
