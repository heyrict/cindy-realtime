/**
 *
 * PaginatorBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getQueryStr, setQueryStr } from 'common';
import { makeSelectLocation } from 'containers/App/selectors';

import { Box, Flex } from 'rebass';
import { ButtonOutline } from 'style-store';
import { Link } from 'react-router-dom';
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
    this.confinePage = (page, maxNum, minNum) => {
      let confined = page;
      if (page < minNum) confined = minNum;
      if (page > maxNum) confined = maxNum;
      return confined;
    };
    this.query = getQueryStr(props.location.search);
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
        nextPage = this.confinePage(nextPage, props.numPages, 1);
      } else {
        nextPage = this.confinePage(p, props.numPages, 1);
        this.setState({ value: nextPage });
      }

      props.changePage(nextPage);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage !== this.props.currentPage) {
      this.setState({ value: nextProps.currentPage });
    }
  }

  render() {
    return (
      <Constrained level={4}>
        <Flex align="center">
          <Box mr="auto">
            <Link
              rel="prev"
              to={setQueryStr({
                ...this.query,
                [this.props.queryKey]: this.confinePage(
                  this.props.currentPage - 1
                ),
              })}
            >
              <SqBtn disabled={this.props.currentPage === 1}>
                <FormattedMessage {...messages.prev} />
              </SqBtn>
            </Link>
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
            <Link
              rel="next"
              to={setQueryStr({
                ...this.query,
                [this.props.queryKey]: this.confinePage(
                  this.props.currentPage + 1
                ),
              })}
            >
              <SqBtn disabled={this.props.currentPage === this.props.numPages}>
                <FormattedMessage {...messages.next} />
              </SqBtn>
            </Link>
          </Box>
        </Flex>
      </Constrained>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  location: makeSelectLocation(),
});

const withConnect = connect(mapStateToProps);

PaginatorBar.propTypes = {
  changePage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  numPages: PropTypes.number.isRequired,
  queryKey: PropTypes.string.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
};

export default compose(withConnect)(PaginatorBar);
