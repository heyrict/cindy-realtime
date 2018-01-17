import { graphql } from 'react-relay';
const PuzzleAddFormMutation = graphql`
  mutation PuzzleAddFormMutation($input: CreatePuzzleInput!) {
    createPuzzle(input: $input) {
      puzzle {
        id
        rowid
      }
    }
  }
`;

export default PuzzleAddFormMutation;
