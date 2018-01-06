/**
 *
 * Asynchronously loads the component for PuzzleActiveList
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
