/*
 *
 * Settings constants
 *
 */

export const CHANGE_SETTING = 'app/Settings/CHANGE_SETTING';
export const SAVE_SETTINGS = 'app/Settings/SAVE_SETTINGS';

export const OPTIONS_SEND = {
  NONE: 'NONE',
  ON_RETURN: 'ONRETURN',
  ON_SHIFT_RETURN: 'ONSRETURN',
};

export const defaultSettings = {
  sendChat: 'NONE',
  sendQuestion: 'ONRETURN',
  sendAnswer: 'ONRETURN',
  modifyQuestion: 'NONE',
};
