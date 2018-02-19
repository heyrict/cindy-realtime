import gql from 'graphql-tag';

const UpdateStarMutation = gql`
  mutation UpdateStarMutation($input: UpdateStarInput!) {
    updateStar(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdateStarMutation;
