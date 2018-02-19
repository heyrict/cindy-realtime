import gql from 'graphql-tag';

export const AwardList = gql`
  query AwardList($count: Int, $cursor: String, $groupName: String) {
    allAwards(first: $count, after: $cursor, groupName: $groupName)
      @connection(key: "AwardNode_allAwards", filter: ["groupName"]) {
      edges {
        node {
          id
          name
          description
          groupName
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export default AwardList;
