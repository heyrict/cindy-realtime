import React from 'react';
import { mountWithIntl } from 'test_helpers';

import withModal from '../index';

const Header = 'header';
const Body = () => <div id="body" />;

describe('<ModalContainer />', () => {
  it('mounts with header', () => {
    const Element = withModal({ header: Header })(Body);
    const rendered = mountWithIntl(<Element show onHide={() => {}} />);
    expect(rendered.contains(Header)).toEqual(true);
  });
});
