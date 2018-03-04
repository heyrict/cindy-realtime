import gql from 'graphql-tag';
import PuzzlePanel from './PuzzlePanel';

export const PuzzleSubscription = gql`
  subscription PuzzleSubscription {
    puzzleSub {
      ...PuzzlePanel_node
    }
  }
  ${PuzzlePanel}
`;

export default PuzzleSubscription;
