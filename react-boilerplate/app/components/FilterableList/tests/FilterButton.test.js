import React from 'react';
import { mountWithIntl } from 'test/helpers';

import FilterButton from '../FilterButton';

describe('<FilterButton />', () => {
  const onMainButtonClickSpy = jest.fn();
  const onSortButtonClickSpy = jest.fn();
  const rendered = mountWithIntl(
    <FilterButton
      name={'id'}
      onMainButtonClick={onMainButtonClickSpy}
      onSortButtonClick={onSortButtonClickSpy}
    />,
  );

  it('Expect to render MainButton with no asc', () => {
    expect(rendered.find('button')).toHaveLength(1);
    rendered.setProps({ asc: null });
    expect(rendered.find('button')).toHaveLength(1);
  });

  it('Expect to render SortButton with asc', () => {
    rendered.setProps({ asc: true });
    expect(rendered.find('button')).toHaveLength(2);
    rendered.setProps({ asc: false });
    expect(rendered.find('button')).toHaveLength(2);
  });

  it('Expect to render if name not exist in messages', () => {
    const filterName = 'non-exist-filter';
    rendered.setProps({ name: filterName });
    expect(rendered.text()).toContain(filterName);
  });

  it('Expect to contain index', () => {
    const index = 0;
    rendered.setProps({ index });
    expect(rendered.text()).toContain(index + 1);
  });

  it('Expect all buttons are called properly', () => {
    rendered.find('button').forEach((node) => {
      node.simulate('click');
    });
    expect(onMainButtonClickSpy).toHaveBeenCalled();
    expect(onSortButtonClickSpy).toHaveBeenCalled();
  });
});
