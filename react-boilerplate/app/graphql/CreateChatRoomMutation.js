import { graphql } from 'react-relay';

const CreateChatRoomMutation = graphql`
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
