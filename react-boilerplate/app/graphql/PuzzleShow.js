import gql from 'graphql-tag';
import DialoguePanel from './DialoguePanel';

const PuzzleShow = gql`
  query PuzzleShowQuery($id: ID!, $userId: ID!) {
    puzzleShowUnion(id: $id)
      @connection(key: "PuzzleShowUnion_PuzzleShowUnion", filter: ["id"]) {
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
      anonymous
      user {
        ...UserLabel_user
      }
      content
      contentSafe
      solution
      memo
      grotesque
      dazedOn
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
          user {
            ...UserLabel_user
          }
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
