import gql from 'graphql-tag';
import AwardApplication from './AwardApplication';

export const AwardApplicationList = gql`
  query AwardApplicationList(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $applier: ID
  ) {
    allAwardApplications(
      first: $count
      after: $cursor
      orderBy: $orderBy
      applier: $applier
    )
      @connection(
        key: "AwardApplicationNode_allAwardApplications"
        filter: ["orderBy", "applier"]
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
