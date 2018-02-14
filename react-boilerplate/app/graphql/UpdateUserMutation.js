import gql from 'graphql-tag';

export const UpdateUserMutation = gql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateUserMutation;
