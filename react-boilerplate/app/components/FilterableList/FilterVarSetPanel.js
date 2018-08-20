import React from 'react';
import PropTypes from 'prop-types';
import { RoundedPanel, Button, ButtonOutline } from 'style-store';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';

import FilterButton from './FilterButton';
import SearchPanel from './SearchPanel';
import messages from './messages';

const ToggleBtn = (props) => {
  const { on, ...others } = props;
  return on ? <Button {...others} /> : <ButtonOutline {...others} />;
};

ToggleBtn.defaultProps = {
  w: 1,
  py: '5px',
  style: {
    borderRadius: 0,
  },
};

ToggleBtn.propTypes = {
  on: PropTypes.bool,
};

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

    this.handleToggleButtonClick = (display) => this.setState({ display });
    this.handleMainButtonClick = this.handleMainButtonClick.bind(this);
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order !== this.props.order) {
      this.asc = nextProps.order[0] === '-';
      this.curOrder = this.asc ? nextProps.order.slice(1) : nextProps.order;
    }
  }

  // {{{ handleMainButtonClick()
  handleMainButtonClick(name) {
    let order;
    if (this.curOrder === name) {
      order = this.asc ? this.curOrder : `-${this.curOrder}`;
      this.asc = !this.asc;
    } else {
      order = `-${name}`;
    }
    this.props.onOrderChange(order);
  }
  // }}}

  // {{{ handleSortButtonClick()
  handleSortButtonClick() {
    this.props.onOrderChange(this.asc ? this.curOrder : `-${this.curOrder}`);
    this.asc = !this.asc;
  }
  // }}}

  render() {
    this.asc = this.props.order[0] === '-';
    this.curOrder = this.asc ? this.props.order.slice(1) : this.props.order;
    return (
      <RoundedPanel>
        {this.props.filterList.length > 0 && (
          <Flex mx="-2px" mt="-2px">
            <ToggleBtn
              on={this.state.display === this.MODE.SORT}
              onClick={() => this.handleToggleButtonClick(this.MODE.SORT)}
            >
              <FormattedMessage {...messages.sort} />
            </ToggleBtn>
            <ToggleBtn
              on={this.state.display === this.MODE.SEARCH}
              onClick={() => this.handleToggleButtonClick(this.MODE.SEARCH)}
            >
              <FormattedMessage {...messages.search} />
            </ToggleBtn>
          </Flex>
        )}
        <Flex justifyContent="center">
          {this.state.display === this.MODE.SORT && (
            <Flex
              w={1}
              px={1}
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
            >
              {this.props.orderList.map((name) => (
                <Box mr={1} key={name}>
                  <FilterButton
                    name={name}
                    index={this.curOrder === name ? 0 : undefined}
                    asc={this.curOrder === name ? this.asc : undefined}
                    onMainButtonClick={() => this.handleMainButtonClick(name)}
                    onSortButtonClick={() => this.handleSortButtonClick(name)}
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
        </Flex>
      </RoundedPanel>
    );
  }
}

FilterVarSetPanel.propTypes = {
  filterList: PropTypes.array.isRequired,
  orderList: PropTypes.array.isRequired,
  order: PropTypes.string.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterVarSetPanel;
