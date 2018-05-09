import gql from 'graphql-tag';

export const UpdateLastReadDmMutation = gql`
  mutation UpdateLastReadDmMutation($input: UpdateLastReadDmInput!) {
    updateLastReadDm(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateLastReadDmMutation;
