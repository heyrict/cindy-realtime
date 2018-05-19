import React from 'react';
import { shallowWithIntl } from 'test/helpers';
import { TestMdText } from 'test/constants';

import { ButtonOutline as Button } from 'style-store';
import MarkdownPreview from '../index';

describe('<MarkdownPreview />', () => {
  const rendered = shallowWithIntl(<MarkdownPreview content={MDTEXT} />);

  it('Expect to render test markdown text properly', () => {
    expect(rendered.find('div')).toMatchSnapshot();
  });

  it('Expect to safely render test markdown text properly', () => {
    rendered.setProps({ safe: true });
    expect(rendered.find('div')).toMatchSnapshot();
  });

  it('Expect to collapse panel on button click', () => {
    expect(rendered.find('[pose="display"]')).toExist();
    rendered.find('[onClick]').simulate('click');
    expect(rendered.find('[pose="collapsed"]')).toExist();
  });
});
