import { takeLatest } from 'redux-saga/effects';
import { getCookie } from 'common';
import { CHANGE_LOCALE } from 'containers/LanguageProvider/constants';

function* handleLanguageChange(action) {
  const locale = action.locale;
  const form = new FormData();
  form.append('language', locale);
  fetch('/i18n/setlang/', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': getCookie('csrftoken'),
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: `language=${locale}`,
  })
    .then((response) => response.text())
    .then(console.log);
}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(CHANGE_LOCALE, handleLanguageChange);
}
