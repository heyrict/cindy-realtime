import gql from 'graphql-tag';

const PuzzleShowSubscription = gql`
  subscription PuzzleShowSubscription ($id: String!) {
    puzzleSub(id: $id) {
      id
      title
      yami
      genre
      status
      content
      solution
      memo
      created
      modified
    }
  }
`;

export default PuzzleShowSubscription;
