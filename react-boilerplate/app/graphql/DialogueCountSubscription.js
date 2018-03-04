import gql from 'graphql-tag';

const DialogueCountSubscription = gql`
  subscription DialogueCountSubscription {
    dialogueSub {
      id
      puzzle {
        id
        quesCount
        uaquesCount
      }
    }
  }
`;

export default DialogueCountSubscription;
