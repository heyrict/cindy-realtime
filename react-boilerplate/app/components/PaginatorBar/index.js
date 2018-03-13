/**
 *
 * PaginatorBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box, Flex } from 'rebass';
import { ButtonOutline } from 'style-store';
import Constrained from 'components/Constrained';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

const SqBtn = ButtonOutline.extend`
  padding: 5px;
  margin: 5px;
  max-width: 40px;
  max-height: 40px;
`;

const SqInput = styled.input`
  border: 2px solid #2075c7;
  border-radius: 10px 0 0 10px;
  padding: 3px 3px;
  margin-left: 5px;
  max-width: 40px;
  max-height: 40px;
  &:focus {
    border: 2px solid #0f64b6;
  }
`;

const SqSubmit = styled.button`
  border: 1px solid #2075c7;
  border-radius: 0 10px 10px 0;
  border-left: 0;
  color: blanchedalmond;
  background-color: #2075c7;
  font-weight: bold;
  padding: 3px 3px;
  margin-right: 5px;
  max-width: 40px;
  max-height: 40px;
  &:hover {
    border: 1px solid #0f64b6;
    background-color: 1px solid #0f64b6;
  }
`;

class PaginatorBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.currentPage || 1,
    };
    this.handleChange = (e) => this.setState({ value: e.target.value });
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    };
    this.handleSubmit = (p) => {
      let nextPage;
      if (p === undefined) {
        nextPage = parseInt(this.state.value, 10);
        if (isNaN(nextPage)) {
          this.setState({ value: props.currentPage });
          return;
        }
        if (nextPage < 1) nextPage = 1;
        if (nextPage > props.numPages) nextPage = props.numPages;
      } else {
        nextPage = p;
        if (nextPage < 1) nextPage = 1;
        if (nextPage > props.numPages) nextPage = props.numPages;
        this.setState({ value: nextPage });
      }

      props.changePage(nextPage);
    };
  }
  render() {
    return (
      <Constrained level={4}>
        <Flex align="center">
          <Box mr="auto">
            <SqBtn
              onClick={() => this.handleSubmit(this.props.currentPage - 1)}
              disabled={this.props.currentPage === 1}
            >
              <FormattedMessage {...messages.prev} />
            </SqBtn>
          </Box>
          <Box mx="auto">
            <SqInput
              value={this.state.value}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
            <SqSubmit onClick={() => this.handleSubmit()}>
              <FormattedMessage {...messages.jump} />
            </SqSubmit>
          </Box>
          <Box ml="auto">
            <SqBtn
              onClick={() => this.handleSubmit(this.props.currentPage + 1)}
              disabled={this.props.currentPage === this.props.numPages}
            >
              <FormattedMessage {...messages.next} />
            </SqBtn>
          </Box>
        </Flex>
      </Constrained>
    );
  }
}

PaginatorBar.propTypes = {
  changePage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  numPages: PropTypes.number.isRequired,
};

export default PaginatorBar;
