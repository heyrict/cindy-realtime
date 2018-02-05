/**
 *
 * Asynchronously loads the component for SponsersModel
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
