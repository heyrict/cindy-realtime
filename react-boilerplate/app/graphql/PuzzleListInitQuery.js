import { graphql } from 'react-relay';

export const PuzzleListInitQuery = graphql`
  query PuzzleListInitQuery(
    $count: Int
    $cursor: String
    $orderBy: [String]
    $status: Float
    $status__gt: Float
  ) {
    ...PuzzleList_list
      @arguments(
        count: $count
        cursor: $cursor
        orderBy: $orderBy
        status__gt: $status__gt
        status: $status
      )
  }
`;

export default PuzzleListInitQuery;
