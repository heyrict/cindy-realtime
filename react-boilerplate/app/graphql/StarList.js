import { graphql } from 'react-relay';

const StarList = graphql`
  fragment StarList_list on Query
    @argumentDefinitions(
      count: { type: Int, defaultValue: 3 }
      cursor: { type: String }
      orderBy: { type: "[String]", defaultValue: "-id" }
      user: { type: ID, defaultValue: null }
    ) {
    allStars(first: $count, after: $cursor, orderBy: $orderBy, user: $user)
      @connection(key: "StarNode_allStars") {
      edges {
        node {
          id
          value
          puzzle {
            ...PuzzlePanel_node
          }
        }
      }
    }
  }
`;

export default StarList;
