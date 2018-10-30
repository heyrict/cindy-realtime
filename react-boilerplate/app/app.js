/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Provider as RebassProvider } from 'rebass';
import { ApolloProvider } from 'react-apollo';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Import Apollo Environment
import { client } from 'Environment';

// Import settings
import { googleAnalyticsTrackingID } from 'settings';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Import CSS reset and Global Styles
import rebassTheme from './rebass-theme.json';

// Import exposed actions
import { openChat } from './containers/Chat/actions';

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

// Google Analytics stuff
if (typeof window.gtag === 'function') {
  history.listen((location) => {
    window.gtag('config', googleAnalyticsTrackingID, {
      page_location: location.href,
      page_path: location.pathname,
      page_title: document.title,
    });
  });
}

// exposed functions
window.OpenChat = (channel) => {
  store.dispatch(openChat(channel));
};

const render = (messages) => {
  ReactDOM.render(
    <RebassProvider theme={rebassTheme}>
      <Provider store={store}>
        <LanguageProvider messages={messages}>
          <ApolloProvider client={client}>
            <ConnectedRouter history={history}>
              <App />
            </ConnectedRouter>
          </ApolloProvider>
        </LanguageProvider>
      </Provider>
    </RebassProvider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise((resolve) => {
    resolve(import('intl'));
  })
    .then(() =>
      Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/ja.js'),
      ]),
    )
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
