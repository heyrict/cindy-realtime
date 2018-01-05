/**
 *
 * Asynchronously loads the component for StatusLabel
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
