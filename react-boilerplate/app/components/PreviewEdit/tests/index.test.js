import React from 'react';
import { shallow } from 'enzyme';

import PreviewEdit from '../index';
import { AutoResizeTextarea } from 'style-store';
import MarkdownPreview from 'components/MarkdownPreview';

describe('<PreviewEdit />', () => {
  const rendered = shallow(<PreviewEdit />);
  it('Expect to render Textarea with MarkdownPreview', () => {
    expect(rendered.find(AutoResizeTextarea)).toExist();
    expect(rendered.find(MarkdownPreview)).toExist();
  });
});
