import React from 'react';
import { shallow } from 'enzyme';
import { getQueryStr } from 'common';

import { FilterableList } from '../index';
import FilterVarSetPanel from '../FilterVarSetPanel';

const Component = (props) => <div id="test" {...props} />;

describe('<FilterableList />', () => {
  const testProps = {
    variables: {
      id: 'fakeId',
    },
    order: '-id',
    orderList: ['id', 'created'],
    filter: {},
    filterList: ['id'],
  };

  it('Expect to render component', () => {
    const gotoSpy = jest.fn();
    const rendered = shallow(
      <FilterableList component={Component} goto={gotoSpy} />,
    );
    expect(rendered.find(Component)).toExist();
  });

  it('Expect to render component with proper Props', () => {
    const gotoSpy = jest.fn();
    const rendered = shallow(
      <FilterableList component={Component} goto={gotoSpy} {...testProps} />,
    );
    expect(rendered.find(Component).prop('variables')).toMatchObject(
      testProps.variables,
    );
    const bar = rendered.find(FilterVarSetPanel);
    expect(bar.prop('orderList')).toMatchObject(testProps.orderList);
    expect(bar.prop('filterList')).toMatchObject(testProps.filterList);
    expect(bar.prop('order')).toBe(testProps.order);
  });

  it('Expect query to change properly', () => {
    let query = { order: '-id', filterKey: 'id', filterValue: 'fakeId' };
    const gotoSpy = jest.fn((q) => (query = getQueryStr(q)));
    const rendered = shallow(
      <FilterableList component={Component} goto={gotoSpy} {...testProps} />,
    );
    const bar = rendered.find(FilterVarSetPanel);

    // change filter
    const newFilter = { filterKey: 'id', filterValue: 'newId' };
    bar.prop('onFilterChange')(newFilter.filterKey, newFilter.filterValue);
    expect(query).toMatchObject(newFilter);

    // change order
    const newOrder = { order: 'id' };
    bar.prop('onOrderChange')(newOrder.order);
    expect(query).toMatchObject(newOrder);
  });
});
