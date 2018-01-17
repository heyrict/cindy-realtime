import { graphql } from 'react-relay';

const RegisterFormMutation = graphql`
  mutation RegisterFormMutation($input: UserRegisterInput!) {
    register(input: $input) {
      user {
        rowid
        nickname
      }
    }
  }
`;

export default RegisterFormMutation;
