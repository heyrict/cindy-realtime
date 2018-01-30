/**
 *
 * TopNavbar action
 *
 */

import { TOGGLE_SUBNAV } from './constants';

export const toggleSubNav = (subnav) => ({
  type: TOGGLE_SUBNAV,
  subnav,
});
