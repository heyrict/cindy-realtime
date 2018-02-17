import gql from 'graphql-tag';
import ChatMessage from './ChatMessage';

const ChatMessageSubscription = gql`
  subscription ChatMessageSubscription($chatroomName: String!) {
    chatmessageSub(chatroomName: $chatroomName) {
      ...ChatMessage
    }
  }
  ${ChatMessage}
`;

export default ChatMessageSubscription;
