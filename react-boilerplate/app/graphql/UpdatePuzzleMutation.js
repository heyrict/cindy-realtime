import { graphql } from 'react-relay';

const UpdatePuzzleMutation = graphql`
  mutation UpdatePuzzleMutation($input: UpdatePuzzleInput!) {
    updatePuzzle(input: $input) {
      clientMutationId
    }
  }
`;

export default UpdatePuzzleMutation;
