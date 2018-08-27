/**
 *
 * PaginatorBar
 *
 */

/* eslint-disable jsx-a11y/anchor-is-valid */

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
  margin: 5px 0;
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

const SqIndic = styled.span`
  display: inline-box;
  color: #465a61;
  background-color: transparent;
  font-weight: bold;
  padding: 3px 3px;
  max-width: 40px;
  max-height: 40px;
`;

const SqSubmit = styled.button`
  border: 2px solid #2075c7;
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
    border: 2px solid #0f64b6;
    background-color: #0f64b6;
  }
`;

class PaginatorBar extends React.Component {
  constructor(props) {
    super(props);
    this.confinePage = (page, maxNum = this.props.numPages, minNum = 1) => {
      if (page < minNum) return minNum;
      if (page > maxNum) return maxNum;
      return page;
    };
    this.query = getQueryStr(this.props.location.search);
    this.state = {
      value: this.props.currentPage || 1,
    };
    this.handleChange = (e) => this.setState({ value: e.target.value });
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    };
    this.handleSubmit = (p) => {
      let nextPage;
      if (p === undefined) {
        nextPage = parseInt(this.state.value, 10);
        if (Number.isNaN(nextPage)) {
          this.setState({ value: this.props.currentPage });
          return;
        }
        nextPage = this.confinePage(nextPage);
      } else {
        nextPage = this.confinePage(p);
        this.setState({ value: nextPage });
      }

      this.props.changePage(nextPage);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage !== this.props.currentPage) {
      this.setState({ value: nextProps.currentPage });
    }
  }

  render() {
    const { useQuery } = this.props;
    const prevBtn = useQuery ? (
      <Link
        rel="prev"
        to={setQueryStr({
          ...this.query,
          page: this.confinePage(this.props.currentPage - 1),
        })}
      >
        <SqBtn disabled={this.props.currentPage === 1}>
          <FormattedMessage {...messages.prev} />
        </SqBtn>
      </Link>
    ) : (
      <SqBtn
        rel="prev"
        disabled={this.props.currentPage === 1}
        onClick={() =>
          this.props.changePage(this.confinePage(this.props.currentPage - 1))
        }
      >
        <FormattedMessage {...messages.prev} />
      </SqBtn>
    );

    const nextBtn = useQuery ? (
      <Link
        rel="next"
        to={setQueryStr({
          ...this.query,
          page: this.confinePage(this.props.currentPage + 1),
        })}
      >
        <SqBtn disabled={this.props.currentPage === this.props.numPages}>
          <FormattedMessage {...messages.next} />
        </SqBtn>
      </Link>
    ) : (
      <SqBtn
        rel="next"
        disabled={this.props.currentPage === this.props.numPages}
        onClick={() =>
          this.props.changePage(this.confinePage(this.props.currentPage + 1))
        }
      >
        <FormattedMessage {...messages.next} />
      </SqBtn>
    );

    return (
      <Constrained level={4} mb={2}>
        <Flex alignItems="center">
          <Box mr="auto">{prevBtn}</Box>
          <Box mx="auto">
            <SqInput
              value={this.state.value}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
            />
            <SqIndic>/ {this.props.numPages}</SqIndic>
            <SqSubmit onClick={() => this.handleSubmit()}>
              <FormattedMessage {...messages.jump} />
            </SqSubmit>
          </Box>
          <Box ml="auto">{nextBtn}</Box>
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
  numPages: PropTypes.number,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  useQuery: PropTypes.bool,
};

PaginatorBar.defaultProps = {
  useQuery: true,
  numPages: 1,
};

export default compose(withConnect)(PaginatorBar);
