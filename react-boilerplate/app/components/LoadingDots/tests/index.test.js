import React from 'react';
import { shallow, mount } from 'enzyme';

import LoadingDots, { Dot } from '../index';

describe('<LoadingDots />', () => {
  describe('<LoadingDots />', () => {
    it('Changing size of LoadingDots', () => {
      const size = 3;
      const rendered = shallow(<LoadingDots size={size} />);
      expect(rendered.find('[active=true]').length).toEqual(1);
      expect(rendered.find('[active=true]').prop('size')).toEqual(size);
    });
    it('Showing animation', () => {
      jest.useFakeTimers();

      // Start Timer
      const rendered = mount(<LoadingDots />);
      expect(rendered.find('[active=true]').length).toEqual(1);
      expect(window.setInterval).toHaveBeenCalledTimes(1);
      const active1 = rendered.state('active');

      // After one timer count
      jest.runOnlyPendingTimers();
      const active2 = rendered.state('active');
      expect(active1).not.toBe(active2);

      // Clear Timer
      rendered.unmount();
      expect(window.clearInterval).toHaveBeenCalledTimes(1);
    });
  });
  describe('<Dot />', () => {
    it('Without Props', () => {
      const rendered = shallow(<Dot />);
      expect(rendered).toMatchSnapshot();
    });
    it('With Props', () => {
      const rendered = shallow(<Dot size={3} active />);
      expect(rendered).toMatchSnapshot();
    });
  });
});
