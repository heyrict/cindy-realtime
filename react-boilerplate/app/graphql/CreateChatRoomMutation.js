import gql from 'graphql-tag';

const CreateChatRoomMutation = gql`
  mutation CreateChatRoomMutation($input: CreateChatRoomInput!) {
    createChatroom(input: $input) {
      chatroom {
        id
        description
        created
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

export default CreateChatRoomMutation;
