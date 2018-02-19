import gql from 'graphql-tag';
import ChatMessage from './ChatMessage';

const ChatQuery = gql`
  query ChatQuery($chatroomName: String!, $before: String) {
    allChatmessages(
      chatroomName: $chatroomName
      before: $before
      last: 10
      orderBy: "id"
    ) @connection(key: "ChatMessageNode_ChatQuery", filter: ["chatroomName"]) {
      pageInfo {
        startCursor
        hasPreviousPage
      }
      edges {
        node {
          ...ChatMessage
        }
      }
    }
  }
  ${ChatMessage}
`;

export default ChatQuery;
