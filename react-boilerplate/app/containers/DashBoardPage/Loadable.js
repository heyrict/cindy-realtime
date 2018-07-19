/**
 *
 * Asynchronously loads the component for DashBoardPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
