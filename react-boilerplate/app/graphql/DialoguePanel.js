import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const DialoguePanel = gql`
  fragment DialoguePanel on DialogueNode {
    id
    user {
      ...UserLabel_user
    }
    good
    true
    question
    answer
    questionEditTimes
    answerEditTimes
    created
    answeredtime
  }
  ${UserLabel}
`;

export default DialoguePanel;
