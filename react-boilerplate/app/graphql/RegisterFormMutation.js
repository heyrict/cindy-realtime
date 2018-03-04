import gql from 'graphql-tag';

const RegisterFormMutation = gql`
  mutation RegisterFormMutation($input: UserRegisterInput!) {
    register(input: $input) {
      user {
        rowid
        nickname
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

export default RegisterFormMutation;
