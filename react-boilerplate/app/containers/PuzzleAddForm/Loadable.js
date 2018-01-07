/**
 *
 * Asynchronously loads the component for PuzzleAddForm
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
