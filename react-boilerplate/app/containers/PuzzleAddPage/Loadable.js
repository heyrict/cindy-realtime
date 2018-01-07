/**
 *
 * Asynchronously loads the component for PuzzleAddPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
