import gql from 'graphql-tag';
import DialoguePanel from './DialoguePanel';

export const DialogueSubscription = gql`
  subscription DialogueSubscription($id: String!) {
    puzzleShowUnionSub(id: $id) {
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
  ${DialoguePanel}
`;

export default DialogueSubscription;
