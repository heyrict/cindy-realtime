/* eslint-disable no-param-reassign */

import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';
import messages from 'translations/en.json';

export const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const { intl } = intlProvider.getChildContext();

function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node, { context, ...additionalOptions } = {}) {
  if (node.type.name === 'InjectIntl') {
    const unwrappedType = node.type.WrappedComponent;
    node = React.createElement(unwrappedType, node.props);
  }
  return shallow(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    ...additionalOptions,
  });
}

export function mountWithIntl(
  node,
  { context, childContextTypes, ...additionalOptions } = {}
) {
  if (node.type.name === 'InjectIntl') {
    const unwrappedType = node.type.WrappedComponent;
    node = React.createElement(unwrappedType, node.props);
  }
  return mount(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    childContextTypes: Object.assign(
      {},
      { intl: intlShape },
      childContextTypes
    ),
    ...additionalOptions,
  });
}
