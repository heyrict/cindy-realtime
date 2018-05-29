import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';
import { Button, Input, Select } from 'style-store';
import { FormattedMessage } from 'react-intl';

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
            {this.props.filterList.map(
              (f) =>
                f in messages ? (
                  <FormattedMessage {...messages[f]} key={f}>
                    {(msg) => <option value={f}>{msg}</option>}
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
            value={this.state.filterValue}
            onChange={this.handleSearchInputChange}
          />
        </Box>
        <Box w={[1, 1, 1 / 12]}>
          <SearchBtn
            w={1}
            onClick={() =>
              this.props.handleSearchButtonClick(
                this.state.filterKey,
                this.state.filterValue
              )
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
