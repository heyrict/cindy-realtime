import gql from 'graphql-tag';

const UpdateAwardApplicationMutation = gql`
  mutation UpdateAwardApplicationMutation($input: UpdateAwardApplicationInput!) {
    updateAwardApplication(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateAwardApplicationMutation;
