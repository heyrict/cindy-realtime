import React from 'react';
import { shallow } from 'enzyme';

import Constrained from '../index';

describe('<Constrained />', () => {
  it('Expect to render children properly with level 1 ~ 5', () => {
    for (let level = 0; level <= 5; level += 1) {
      const wrapper = shallow(
        <Constrained level={level}>
          <div className="test_class" />
        </Constrained>
      );
      expect(wrapper.contains(<div className="test_class" />)).toBe(true);
    }
  });
  it('Expect to accept extra props properly', () => {
    const wrapper = shallow(
      <Constrained p={3} m={1}>
        <div className="test_class" />
      </Constrained>
    );
    expect(wrapper.contains(<div className="test_class" />)).toBe(true);
  });
});
