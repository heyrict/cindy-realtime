/**
 *
 * Asynchronously loads the component for AwardApplicationPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
