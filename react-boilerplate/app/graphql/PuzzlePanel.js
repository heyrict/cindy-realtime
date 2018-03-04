import gql from 'graphql-tag';
import UserLabel from './UserLabel';

const PuzzlePanel = gql`
  fragment PuzzlePanel_node on PuzzleNode {
    id
    rowid
    genre
    yami
    title
    status
    created
    quesCount
    uaquesCount
    starSet {
      edges {
        node {
          user {
            nickname
          }
          value
        }
      }
    }
    commentCount
    bookmarkCount
    user {
      ...UserLabel_user
    }
  }
  ${UserLabel}
`;

export default PuzzlePanel;
