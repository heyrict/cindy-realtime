import gql from 'graphql-tag';
import DialoguePanel from './DialoguePanel';

export const DialogueSubscription = gql`
  subscription DialogueSubscription {
    dialogueSub {
      ...DialoguePanel
    }
  }
  ${DialoguePanel}
`;

export default DialogueSubscription;
