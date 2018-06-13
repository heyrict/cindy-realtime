import gql from 'graphql-tag';
import ChatMessage from './ChatMessage';

const ChatLogQuery = gql`
  query ChatLogQuery($chatroomName: String!, $limit: Int, $offset: Int) {
    allChatmessagesLo(
      chatroomName: $chatroomName
      limit: $limit
      offset: $offset
      orderBy: "id"
    )
      @connection(
        key: "ChatMessageNode_ChatLogQuery"
        filter: ["chatroomName", "offset"]
      ) {
      edges {
        node {
          ...ChatMessage
        }
      }
      totalCount
    }
  }
  ${ChatMessage}
`;

export default ChatLogQuery;
