import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';
import { Button, Input, Select } from 'style-store';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

export const SearchBtn = styled(Button)`
  border-radius: 10px;
  padding: 5px;
  min-width: 50px;
  min-height: 36px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const SearchSelect = styled(Select)`
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

export const SearchInput = styled(Input)`
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

class SearchPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterKey:
        this.props.filterList.length > 0 ? this.props.filterList[0] : '',
      filterValue: '',
    };

    this.handleFilterChange = (e) =>
      this.setState({ filterKey: e.target.value });
    this.handleSearchInputChange = (e) =>
      this.setState({ filterValue: e.target.value.slice(0, 64) });
  }

  renderFilterOptions(filter) {
    if (typeof filter === 'object' && filter.options) {
      return null;
    }

    const filterKey = typeof filter === 'string' ? filter : filter.name;

    if (filterKey in messages) {
      return (
        <FormattedMessage {...messages[filterKey]} key={filterKey}>
          {(msg) => <option value={filterKey}>{msg}</option>}
        </FormattedMessage>
      );
    }
    return (
      <option value={filterKey} key={filterKey}>
        {filterKey}
      </option>
    );
  }

  render() {
    return (
      <Flex
        w={1}
        px={1}
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
      >
        <Box w={[1 / 3, 1 / 4, 1 / 6]}>
          <SearchSelect
            style={{ borderRadius: '10px 0 0 10px' }}
            value={this.state.filterKey}
            onChange={this.handleFilterChange}
          >
            {this.props.filterList.map(this.renderFilterOptions)}
          </SearchSelect>
        </Box>
        <Box w={[2 / 3, 3 / 4]}>
          <SearchInput
            value={this.state.filterValue}
            onChange={this.handleSearchInputChange}
          />
        </Box>
        <Box w={[1, 1, 1 / 12]}>
          <SearchBtn
            w={1}
            onClick={() =>
              this.props.handleSearchButtonClick({
                [this.state.filterKey]: this.state.filterValue,
              })
            }
            style={{ borderRadius: '10px' }}
          >
            <FormattedMessage {...messages.search} />
          </SearchBtn>
        </Box>
      </Flex>
    );
  }
}

SearchPanel.propTypes = {
  filterList: PropTypes.array,
  handleSearchButtonClick: PropTypes.func.isRequired,
};

export default SearchPanel;
