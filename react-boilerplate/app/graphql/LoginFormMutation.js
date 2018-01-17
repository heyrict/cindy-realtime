import { graphql } from 'react-relay';

const LoginFormMutation = graphql`
  mutation LoginFormMutation($input: UserLoginInput!) {
    login(input: $input) {
      user {
        rowid
        nickname
      }
    }
  }
`;

export default LoginFormMutation;
