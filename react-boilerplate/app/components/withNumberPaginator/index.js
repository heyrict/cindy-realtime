/**
 *
 * NumberPaginatorWrapper
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';

import { selectLocation } from 'containers/App/selectors';
import { getQueryStr, updateQueryStr } from 'common';

/* eslint-disable no-undef */

export function withNumberPaginator() {
  return (Wrapped) => {
    /* Add Paginator handlers */
    const withNumberPaginatorWrapper = (props) => {
      const currentPage = props.page
        ? parseInt(props.page, 10)
        : props.defaultPage;
      const changePage = (page) => {
        props.goto(updateQueryStr({ ...query, page }));
      };
      return (
        <Wrapped
          {...props}
          page={currentPage}
          itemsPerPage={props.itemsPerPage}
          changePage={changePage}
        />
      );
    };

    withNumberPaginatorWrapper.propTypes = {
      defaultPage: PropTypes.number.isRequired,
      itemsPerPage: PropTypes.number.isRequired,
      goto: PropTypes.func.isRequired,
      page: PropTypes.string,
    };

    withNumberPaginatorWrapper.defaultProps = {
      defaultPage: 1,
      itemsPerPage: 10,
    };

    const mapStateToProps = createStructuredSelector({
      page: createSelector(
        selectLocation,
        (location) => getQueryStr(location.get('search')).page
      ),
    });

    const mapDispatchToProps = (dispatch) => ({
      goto: (link) => dispatch(push(link)),
    });

    const withConnect = connect(mapStateToProps, mapDispatchToProps);

    return compose(withConnect)(withNumberPaginatorWrapper);
  };
}

export default withNumberPaginator;
