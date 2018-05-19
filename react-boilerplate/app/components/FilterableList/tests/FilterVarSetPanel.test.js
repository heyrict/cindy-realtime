import React from 'react';
import { shallow } from 'enzyme';

import FilterVarSetPanel, { ToggleBtn } from '../FilterVarSetPanel';
import FilterButton from '../FilterButton';
import SearchPanel from '../SearchPanel';

describe('<FilterVarSetPanel />', () => {
  const onOrderChangeSpy = jest.fn();
  const onFilterChangeSpy = jest.fn();
  const rendered = shallow(<FilterVarSetPanel 
    filterList={['id']}
    orderList={['id', 'created']}
    order={'-id'}
    onOrderChange={onOrderChangeSpy}
    onFilterChange={onFilterChangeSpy}
  />);

  it('Expect to render sort display properly', () => {
    expect(rendered.find(FilterButton)).toHaveLength(2);
  });

  it('Expect order button to work properly', () => {
    const idSort = rendered.find(FilterButton).find('[name="id"]');
    const createdSort = rendered.find(FilterButton).find('[name="created"]');

    createdSort.prop('onMainButtonClick')('created');
    expect(onOrderChangeSpy).toHaveBeenCalledWith('-created');
    idSort.prop('onMainButtonClick')('id');
    expect(onOrderChangeSpy).toHaveBeenCalledWith('id');
    idSort.prop('onSortButtonClick')('id');
    expect(onOrderChangeSpy).toHaveBeenCalledWith('id');
  });

  it('Expect to update to props properly', () => {
    expect(rendered.find(FilterButton).find('[name="id"]').prop('asc')).toBe(true)
    rendered.setProps({ order: 'id' });
    expect(rendered.find(FilterButton).find('[name="id"]').prop('asc')).toBe(false)
    rendered.setProps({ order: '-id' });
    expect(rendered.find(FilterButton).find('[name="id"]').prop('asc')).toBe(true)
  });

  it('Expect to change display correctly', () => {
    rendered.find(ToggleBtn).simulate('click');
    expect(rendered.find(SearchPanel)).toExist();
  });
});
