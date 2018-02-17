import gql from 'graphql-tag';
import DialoguePanel from './DialoguePanel';

const PuzzleShow = gql`
  query($id: ID!, $userId: ID!) {
    puzzleShowUnion(id: $id) {
      edges {
        node {
          ... on DialogueNode {
            ...DialoguePanel
          }

          ... on HintNode {
            id
            content
            created
          }
        }
      }
    }
    puzzle(id: $id) {
      id
      title
      yami
      genre
      status
      user {
        ...UserLabel_user
      }
      content
      solution
      memo
      created
      modified
    }
    allComments(puzzle: $id, user: $userId) {
      edges {
        node {
          id
          content
          spoiler
        }
      }
    }
    allStars(puzzle: $id, user: $userId) {
      edges {
        node {
          id
          value
        }
      }
    }
    allBookmarks(puzzle: $id, user: $userId) {
      edges {
        node {
          id
          value
        }
      }
    }
  }
  ${DialoguePanel}
`;

export default PuzzleShow;
