/*
 *
 * LoginForm actions
 *
 */

import { SHOW_MODAL } from "./constants"

export const show = (status = true) => ({
  type: SHOW_MODAL,
  show: status
})
