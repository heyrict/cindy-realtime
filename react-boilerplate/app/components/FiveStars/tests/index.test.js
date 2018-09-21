import React from 'react';
import { render, mount } from 'enzyme';

import FiveStars from '../index';

describe('<FiveStars />', () => {
  describe('Static FiveStars', () => {
    const STAR_COUNT = 2;
    it('Rendering', () => {
      const rendered = render(<FiveStars value={STAR_COUNT} />);
      expect(rendered.find('[checked]').length).toEqual(STAR_COUNT);
    });
    it('Resizing', () => {
      const STAR_SIZE = '50px';
      const rendered = render(
        <FiveStars value={STAR_COUNT} starSize={STAR_SIZE} />,
      );
      expect(rendered.find('div').prop('style')).toMatchObject({
        'font-size': STAR_SIZE,
      });
    });
  });
  describe('Dynamic FiveStars', () => {
    const STAR_COUNT = 2;
    const CHANGED_STAR_COUNT = 4;

    it('Rendering', () => {
      const onSetSpy = jest.fn();
      const rendered = render(
        <FiveStars value={STAR_COUNT} onSet={onSetSpy} />,
      );
      expect(rendered.find('[checked]').length).toEqual(STAR_COUNT);
    });

    it('Hovering', () => {
      const onSetSpy = jest.fn();
      const rendered = mount(<FiveStars value={STAR_COUNT} onSet={onSetSpy} />);

      // Before hovering
      expect(rendered.state()).toMatchObject({
        value: STAR_COUNT,
        hovered: false,
      });

      // Hovering
      rendered
        .find('div')
        .at(CHANGED_STAR_COUNT)
        .simulate('mouseenter');
      expect(rendered.state()).toMatchObject({
        value: CHANGED_STAR_COUNT,
        hovered: true,
      });

      // After hovering
      rendered
        .find('div')
        .at(CHANGED_STAR_COUNT)
        .simulate('mouseleave');
      expect(rendered.state()).toMatchObject({
        value: CHANGED_STAR_COUNT,
        hovered: false,
      });
    });

    it('Clicking', () => {
      let value = STAR_COUNT;
      const onSetSpy = jest.fn((v) => (value = v));
      const rendered = mount(<FiveStars value={value} onSet={onSetSpy} />);

      // Before clicking
      expect(value).toBe(STAR_COUNT);

      // After clicking
      rendered
        .find('div')
        .at(CHANGED_STAR_COUNT)
        .simulate('click');
      expect(value).toBe(CHANGED_STAR_COUNT);
    });
  });
});
