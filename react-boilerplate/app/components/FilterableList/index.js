/**
 *
 * FilterableList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { FormattedMessage } from 'react-intl';
import { RoundedPanel, Button, Input, Select, ImgXs } from 'style-store';
import { Flex, Box } from 'rebass';

import switcher from 'images/switcher.svg';

import FilterButton from './FilterButton';
import messages from './messages';

const SearchBtn = Button.extend`
  border-radius: 10px;
  padding: 5px;
  min-width: 50px;
  min-height: 36px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const SearchSelect = Select.extend`
  min-height: 36px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 0 10px 10px 0;
  border: 1px solid #ccc;
  box-shadow: unset;
  &:focus {
    box-shadow: unset;
    border: 2px solid #ccc;
  }
`;

const SearchInput = Input.extend`
  min-height: 36px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 0;
  border: 1px solid #ccc;
  box-shadow: unset;
  &:focus {
    box-shadow: unset;
    border: 2px solid #ccc;
  }
`;

const ToggleBtn = Button.extend`
  border-radius: 0;
  padding: 5px;
  min-width: 50px;
  min-height: 36px;
`;

class FilterableList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.MODE = {
      SORT: 'SORT',
      SEARCH: 'SEARCH',
    };
    this.state = {
      display: this.MODE.SORT,
      order: fromJS(this.props.order || []),
      filterKey:
        this.props.filterList.length > 0 ? this.props.filterList[0] : '',
      filterValue: '',
      filter: {},
    };
    this.extraFilter = {};
    // Sorting functions
    this.getOrder = this.getOrder.bind(this);
    // Event handling functions
    this.handleMainButtonClick = this.handleMainButtonClick.bind(this);
    this.handleSortButtonClick = this.handleSortButtonClick.bind(this);
    this.handleSearchButtonClick = () =>
      this.setState((p) => ({
        filter: { [p.filterKey]: this.state.filterValue },
      }));
    this.handleFilterChange = (e) =>
      this.setState({ filterKey: e.target.value });
    this.handleSearchInputChange = (e) =>
      this.setState({ filterValue: e.target.value.slice(0, 64) });
    this.handleToggleButtonClick = () =>
      this.setState((p) => ({
        display:
          p.display === this.MODE.SORT ? this.MODE.SEARCH : this.MODE.SORT,
      }));
  }

  // {{{ getOrder()
  getOrder() {
    return this.state.order
      .toJS()
      .map(({ key, asc }) => (asc ? key : `-${key}`));
  }
  // }}}

  // {{{ handleMainButtonClick()
  handleMainButtonClick(name) {
    this.setState((state) => {
      let order;
      if (state.order.getIn([0, 'key']) === name) {
        order = state.order.updateIn([0, 'asc'], (asc) => !asc);
      } else {
        order = fromJS([{ key: name, asc: false }]);
      }
      return { ...state, order };
    });
  }
  // }}}

  // {{{ handleSortButtonClick()
  handleSortButtonClick() {
    this.setState((state) => ({
      order: state.order.updateIn([0, 'asc'], (asc) => !asc),
    }));
  }
  // }}}

  // {{{ render()
  render() {
    const curOrder = this.state.order.get(0).toJS();
    const { component: QueryList, variables, filter, ...others } = this.props;
    return (
      <div>
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
              <Flex w={1} px={1} wrap justify="center" align="center">
                <Box w={[1 / 3, 1 / 4, 1 / 6]}>
                  <SearchSelect
                    style={{ borderRadius: '10px 0 0 10px' }}
                    value={this.state.filterKey}
                    onChange={this.handleFilterChange}
                  >
                    {this.props.filterList.map(
                      (f) =>
                        f in messages ? (
                          <FormattedMessage {...messages[f]} key={f}>
                            {(msg) => <option value={filter}>{msg}</option>}
                          </FormattedMessage>
                        ) : (
                          <option value={f} key={f}>
                            {f}
                          </option>
                        )
                    )}
                  </SearchSelect>
                </Box>
                <Box w={[2 / 3, 3 / 4]}>
                  <SearchInput
                    value={this.state.searchContent}
                    onChange={this.handleSearchInputChange}
                  />
                </Box>
                <SearchBtn
                  w={[1, 1, 1 / 12]}
                  onClick={this.handleSearchButtonClick}
                  style={{ borderRadius: '0 10px 10px 0' }}
                >
                  <FormattedMessage {...messages.search} />
                </SearchBtn>
              </Flex>
            )}
            {this.props.filterList.length > 0 && (
              <ToggleBtn onClick={this.handleToggleButtonClick}>
                <ImgXs src={switcher} alt="Switch" />
              </ToggleBtn>
            )}
          </Flex>
        </RoundedPanel>
        <QueryList
          variables={{
            orderBy: this.getOrder() || ['-id'],
            ...(this.state.filter || this.props.filter || {}),
            ...variables,
          }}
          {...others}
        />
      </div>
    );
  }
  // }}}
}

FilterableList.defaultProps = {
  variables: {},
  order: [],
  orderList: ['id', 'created'],
  filter: {},
  filterList: [],
};

FilterableList.propTypes = {
  component: PropTypes.any.isRequired,
  variables: PropTypes.object,
  order: PropTypes.array,
  orderList: PropTypes.array,
  filter: PropTypes.object,
  filterList: PropTypes.array,
};

export default FilterableList;
