import gql from 'graphql-tag';

const UpdatePuzzleMutation = gql`
  mutation UpdatePuzzleMutation($input: UpdatePuzzleInput!) {
    updatePuzzle(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdatePuzzleMutation;
