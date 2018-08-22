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
    anonymous
    quesCount
    uaquesCount
    starCount
    starSum
    commentCount
    bookmarkCount
    user {
      ...UserLabel_user
    }
  }
  ${UserLabel}
`;

export default PuzzlePanel;
