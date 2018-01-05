/**
 *
 * Asynchronously loads the component for StarLabel
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
