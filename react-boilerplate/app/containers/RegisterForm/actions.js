/**
 *
 * RegisterForm Actions
 *
 */

import { pushWithLocale as push } from 'common';
/*
import { REGISTER_SUCCEEDED } from './constants';

export const registerSucceeded = () => ({
  type: REGISTER_SUCCEEDED,
});
*/

export const registerSucceeded = (id) => push('/wiki/ja/welcome');
