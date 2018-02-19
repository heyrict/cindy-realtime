import gql from 'graphql-tag';

const LogoutMutation = gql`
  mutation LogoutMutation($input: UserLogoutInput!) {
    logout(input: $input) {
      clientMutationId
    }
  }
`;

export default LogoutMutation;
