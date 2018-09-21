import React from 'react';
import { shallow } from 'enzyme';

import Constrained from '../index';

describe('<Constrained />', () => {
  const level = 3;
  it('Expect to render children properly with level 1 ~ 5', () => {
    const wrapper = shallow(
      <Constrained level={level}>
        <div className="test_class" />
      </Constrained>,
    );
    expect(wrapper.contains(<div className="test_class" />)).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
