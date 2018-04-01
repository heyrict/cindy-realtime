/**
 *
 * NumberPaginatorWrapper
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';

import { makeSelectLocation } from 'containers/App/selectors';
import { getQueryStr, setQueryStr } from 'common';

/* eslint-disable no-undef */

export function withNumberPaginator() {
  return (Wrapped) => {
    /* Add Paginator handlers */
    const withNumberPaginatorWrapper = (props) => {
      const query = getQueryStr(props.location.search) || {};
      const currentPage = query[props.queryKey]
        ? parseInt(query[props.queryKey], 10)
        : props.defaultPage;
      const changePage = (page) => {
        props.goto(setQueryStr({ ...query, [props.queryKey]: page }));
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
      queryKey: PropTypes.string.isRequired,
      goto: PropTypes.func.isRequired,
      location: PropTypes.shape({
        search: PropTypes.string.isRequired,
      }),
    };

    withNumberPaginatorWrapper.defaultProps = {
      defaultPage: 1,
      itemsPerPage: 10,
      queryKey: 'page',
    };

    const mapStateToProps = createStructuredSelector({
      location: makeSelectLocation(),
    });

    const mapDispatchToProps = (dispatch) => ({
      goto: (link) => dispatch(push(link)),
    });

    const withConnect = connect(mapStateToProps, mapDispatchToProps);

    return compose(withConnect)(withNumberPaginatorWrapper);
  };
}

export default withNumberPaginator;
