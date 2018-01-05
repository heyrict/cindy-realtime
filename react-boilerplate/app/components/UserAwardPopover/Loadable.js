/**
 *
 * Asynchronously loads the component for UserAwardPopover
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
