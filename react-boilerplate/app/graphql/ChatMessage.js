import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const ChatMessage = gql`
  fragment ChatMessage on ChatMessageNode {
    id
    content
    created
    editTimes
    user {
      ...UserLabel_user
    }
  }
  ${UserLabel}
`;

export default ChatMessage;
