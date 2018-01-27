/**
 *
 * Asynchronously loads the component for ProfilePuzzlesPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
