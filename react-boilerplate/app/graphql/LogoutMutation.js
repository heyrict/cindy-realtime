import { graphql } from 'react-relay';

const LogoutMutation = graphql`
  mutation LogoutMutation($input: UserLogoutInput!) {
    logout(input: $input) {
      clientMutationId
    }
  }
`;

export default LogoutMutation;
