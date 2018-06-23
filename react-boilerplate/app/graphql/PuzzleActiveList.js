import gql from 'graphql-tag';
import UserLabel from './UserLabel';

export const PuzzleActiveList = gql`
  query PuzzleActiveListQuery($status: Float, $orderBy: [String]) {
    allPuzzles(status: $status, orderBy: $orderBy)
      @connection(key: "PuzzleNode_PuzzleActiveListQuery") {
      edges {
        node {
          id
          rowid
          genre
          yami
          title
          status
          created
          quesCount
          uaquesCount
          user {
            ...UserLabel_user
          }
        }
      }
      totalCount
    }
  }
  ${UserLabel}
`;

export default PuzzleActiveList;
