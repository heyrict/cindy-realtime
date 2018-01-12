/**
 *
 * Asynchronously loads the component for Dialogue
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
