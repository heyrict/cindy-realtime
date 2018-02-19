import gql from 'graphql-tag';
import AwardApplication from './AwardApplication';

export const AwardApplicationList = gql`
  query AwardApplicationList($count: Int, $cursor: String, $orderBy: [String]) {
    allAwardApplications(first: $count, after: $cursor, orderBy: $orderBy)
      @connection(
        key: "AwardApplicationNode_allAwardApplications"
        filter: ["orderBy"]
      ) {
      edges {
        node {
          ...AwardApplication
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${AwardApplication}
`;

export default AwardApplicationList;
