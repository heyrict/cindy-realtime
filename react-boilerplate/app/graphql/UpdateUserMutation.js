import { graphql } from 'react-relay';

export const UpdateUserMutation = graphql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateUserMutation;
