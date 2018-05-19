import React from 'react';
import { shallow } from 'enzyme';
import { OPTIONS_SEND } from 'containers/Settings/constants';

import UnhandledTextarea from '../index';

const initialContent = 'test\n';

describe('<UnhandledTextarea />', () => {
  const rendered = shallow(<UnhandledTextarea content={initialContent} />);
  it('Test keypress', () => {
    Object.entries(OPTIONS_SEND).forEach(([key, value]) => {
      rendered.setProps({ sendPolicy: value });
      rendered
        .instance()
        .handleKeyPress({ nativeEvent: { keyCode: 13, shiftKey: true } });
      rendered
        .instance()
        .handleKeyPress({ nativeEvent: { keyCode: 13, shiftKey: false } });
      rendered.instance().handleKeyPress({ nativeEvent: { keyCode: 1 } });
    });
  });

  it('Test content manipulation', () => {
    const newContent = 'newtest';
    expect(rendered.state('content')).toBe(initialContent);
    rendered.instance().setContent(newContent);
    expect(rendered.instance().getContent()).toBe(newContent);
  });
});
