import gql from 'graphql-tag';

const LoginFormMutation = gql`
  mutation LoginFormMutation($input: UserLoginInput!) {
    login(input: $input) {
      user {
        rowid
        nickname
        lastReadDm {
          id
        }
        favoritechatroomSet {
          edges {
            node {
              chatroom {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export default LoginFormMutation;
