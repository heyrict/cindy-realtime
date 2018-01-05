/**
 *
 * Asynchronously loads the component for PuzzlePage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
