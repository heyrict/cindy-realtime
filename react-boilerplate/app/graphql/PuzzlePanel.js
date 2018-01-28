import { graphql } from 'react-relay';

const PuzzlePanel = graphql`
  fragment PuzzlePanel_node on PuzzleNode {
    id
    rowid
    genre
    yami
    title
    status
    created
    content
    quesCount
    uaquesCount
    starCount
    starSum
    commentCount
    user {
      ...UserLabel_user
    }
  }
`

export default PuzzlePanel;
