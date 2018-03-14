import React from 'react';
import PropTypes from 'prop-types';
import { RoundedPanel, Button, ImgXs } from 'style-store';
import { fromJS } from 'immutable';
import { Flex, Box } from 'rebass';

import switcher from 'images/switcher.svg';

import FilterButton from './FilterButton';
import SearchPanel from './SearchPanel';

const ToggleBtn = Button.extend`
  border-radius: 0;
  padding: 5px;
  min-width: 50px;
  min-height: 36px;
`;

class FilterVarSetPanel extends React.Component {
  constructor(props) {
    super(props);
    this.MODE = {
      SORT: 'SORT',
      SEARCH: 'SEARCH',
    };
    this.state = {
      display: this.MODE.SORT,
    };

    this.handleToggleButtonClick = () =>
      this.setState((p) => ({
        display:
          p.display === this.MODE.SORT ? this.MODE.SEARCH : this.MODE.SORT,
      }));
    this.handleMainButtonClick = this.handleMainButtonClick.bind(this);
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this);
  }

  // {{{ handleMainButtonClick()
  handleMainButtonClick(name) {
    let order;
    if (this.props.order.getIn([0, 'key']) === name) {
      order = this.props.order.updateIn([0, 'asc'], (asc) => !asc);
    } else {
      order = fromJS([{ key: name, asc: false }]);
    }
    this.props.onOrderChange(order);
  }
  // }}}

  // {{{ handleSortButtonClick()
  handleSortButtonClick() {
    this.props.onOrderChange(
      this.props.order.updateIn([0, 'asc'], (asc) => !asc)
    );
  }
  // }}}

  render() {
    const curOrder = this.props.order.get(0).toJS();
    return (
      <RoundedPanel>
        <Flex justify="center">
          {this.state.display === this.MODE.SORT && (
            <Flex w={1} px={1} wrap justify="center" align="center">
              {this.props.orderList.map((name) => (
                <Box mr={1} key={name}>
                  <FilterButton
                    name={name}
                    index={curOrder.key === name ? 0 : undefined}
                    asc={curOrder.key === name ? curOrder.asc : undefined}
                    onMainButtonClick={this.handleMainButtonClick}
                    onSortButtonClick={this.handleSortButtonClick}
                  />
                </Box>
              ))}
            </Flex>
          )}
          {this.state.display === this.MODE.SEARCH && (
            <SearchPanel
              filterList={this.props.filterList}
              handleSearchButtonClick={this.props.onFilterChange}
            />
          )}
          {this.props.filterList.length > 0 && (
            <ToggleBtn onClick={this.handleToggleButtonClick}>
              <ImgXs src={switcher} alt="Switch" />
            </ToggleBtn>
          )}
        </Flex>
      </RoundedPanel>
    );
  }
}

FilterVarSetPanel.propTypes = {
  filterList: PropTypes.array.isRequired,
  orderList: PropTypes.array.isRequired,
  order: PropTypes.object.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterVarSetPanel;
