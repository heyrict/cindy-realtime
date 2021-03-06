import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { RoundedPanel, Button, ButtonOutline } from 'style-store';
import { FormattedMessage } from 'react-intl';
import { Flex, Box, ButtonTransparent as RebassBT } from 'rebass';

import FilterButton from './FilterButton';
import SearchPanel from './SearchPanel';
import AdvancedSearchPanel from './AdvancedSearchPanel';
import messages from './messages';

const ButtonTransparent = styled(RebassBT)`
  padding: 2px;
  overflow: hidden;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

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
      ADVSEARCH: 'ADVSEARCH',
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
              on={
                this.state.display === this.MODE.SEARCH ||
                this.state.display === this.MODE.ADVSEARCH
              }
              onClick={() => this.handleToggleButtonClick(this.MODE.SEARCH)}
            >
              <FormattedMessage {...messages.search} />
            </ToggleBtn>
          </Flex>
        )}
        <Flex justifyContent="center" flexWrap="wrap">
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
            <Box w={1} mx={2} style={{ textAlign: 'right' }}>
              <ButtonTransparent
                onClick={() =>
                  this.handleToggleButtonClick(this.MODE.ADVSEARCH)
                }
              >
                <FormattedMessage {...messages.goToAdvanced} />
              </ButtonTransparent>
            </Box>
          )}
          {this.state.display === this.MODE.ADVSEARCH && (
            <Box w={1} mx={2}>
              <ButtonTransparent
                onClick={() => this.handleToggleButtonClick(this.MODE.SEARCH)}
              >
                <FormattedMessage {...messages.backToSimple} />
              </ButtonTransparent>
            </Box>
          )}
          {this.state.display === this.MODE.SEARCH && (
            <SearchPanel
              filterList={this.props.filterList}
              handleSearchButtonClick={this.props.onFilterChange}
            />
          )}
          {this.state.display === this.MODE.ADVSEARCH && (
            <AdvancedSearchPanel
              filterList={this.props.filterList}
              currentFilter={this.props.currentFilter}
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
  currentFilter: PropTypes.object.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterVarSetPanel;
