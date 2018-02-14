import gql from 'graphql-tag';
const PuzzleAddFormMutation = gql`
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
