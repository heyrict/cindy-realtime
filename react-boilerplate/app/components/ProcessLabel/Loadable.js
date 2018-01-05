/**
 *
 * Asynchronously loads the component for ProcessLabel
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
