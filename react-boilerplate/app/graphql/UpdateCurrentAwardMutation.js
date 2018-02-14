import gql from 'graphql-tag';

export const UpdateCurrentAwardMutation = gql`
  mutation UpdateCurrentAwardMutation($input: UpdateCurrentAwardInput!) {
    updateCurrentAward(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateCurrentAwardMutation;
