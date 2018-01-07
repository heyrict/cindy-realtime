/**
 *
 * Asynchronously loads the component for RegisterForm
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
