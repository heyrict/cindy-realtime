import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';
import { FormattedMessage } from 'react-intl';
import ButtonSelect from 'components/ButtonSelect';

import { SearchBtn, SearchInput } from './SearchPanel';
import messages from './messages';

const SearchIndicator = styled.div`
  min-height: 36px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 0 10px 10px 0;
  border: 1px solid #ccc;
  box-shadow: unset;
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #586e75;
  background-color: #eee8d5;
`;

class AdvancedSearchPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.init_state = props.currentFilter;
    this.props.filterList.forEach((filter) => {
      if (typeof filter === 'string') {
        if (filter in this.init_state) return;
        this.init_state = { ...this.init_state, [filter]: '' };
      } else {
        if (filter.name in this.init_state) return;
        this.init_state = { ...this.init_state, [filter.name]: '' };
      }
    });

    this.state = this.init_state;

    this.handleChange = (key, e) => this.setState({ [key]: e.target.value });
    this.handleSelectChange = (key, opt) => this.setState({ [key]: opt.value });
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
        {this.props.filterList.map(
          (filter) =>
            typeof filter === 'string' ? (
              <Flex w={1} key={filter}>
                <Box w={[1 / 3, 1 / 4]}>
                  <SearchIndicator style={{ borderRadius: '10px 0 0 10px' }}>
                    {filter in messages ? (
                      <FormattedMessage {...messages[filter]} key={filter} />
                    ) : (
                      filter
                    )}
                  </SearchIndicator>
                </Box>
                <Box w={[2 / 3, 3 / 4]}>
                  <SearchInput
                    value={this.state[filter]}
                    onChange={this.handleChange.bind(this, filter)}
                  />
                </Box>
              </Flex>
            ) : (
              <Flex w={1} key={filter.name}>
                <Box w={[1 / 3, 1 / 4]}>
                  <SearchIndicator style={{ borderRadius: '10px 0 0 10px' }}>
                    {filter.name in messages ? (
                      <FormattedMessage
                        {...messages[filter.name]}
                        key={filter.name}
                      />
                    ) : (
                      filter.name
                    )}
                  </SearchIndicator>
                </Box>
                <Box w={[2 / 3, 3 / 4]}>
                  <ButtonSelect
                    style={{ marginTop: '5px' }}
                    value={this.state[filter.name]}
                    options={filter.options}
                    onChange={this.handleSelectChange.bind(this, filter.name)}
                  />
                </Box>
              </Flex>
            ),
        )}
        <Box w={1}>
          <SearchBtn
            w={1}
            onClick={() => this.props.handleSearchButtonClick(this.state)}
            style={{ borderRadius: '10px' }}
          >
            <FormattedMessage {...messages.search} />
          </SearchBtn>
        </Box>
      </Flex>
    );
  }
}

AdvancedSearchPanel.propTypes = {
  filterList: PropTypes.array,
  currentFilter: PropTypes.object,
  handleSearchButtonClick: PropTypes.func.isRequired,
};

export default AdvancedSearchPanel;
