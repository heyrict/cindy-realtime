/**
 *
 * NumberPaginatorWrapper
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable no-undef */

export function withNumberPaginator() {
  return (Wrapped) => {
    /* Add Paginator handlers */
    class withNumberPaginatorWrapper extends React.PureComponent {
      constructor(props) {
        super(props);
        this.state = {
          page: this.props.defaultPage,
        };
        this.changePage = (page) => this.setState({ page });
      }
      // {{{ render
      render() {
        return (
          <Wrapped
            {...this.props}
            page={this.state.page}
            itemsPerPage={this.props.itemsPerPage}
            changePage={this.changePage}
          />
        );
      }
      // }}}
    }

    withNumberPaginatorWrapper.propTypes = {
      defaultPage: PropTypes.number.isRequired,
      itemsPerPage: PropTypes.number.isRequired,
    };

    withNumberPaginatorWrapper.defaultProps = {
      defaultPage: 1,
      itemsPerPage: 10,
    };

    return withNumberPaginatorWrapper;
  };
}

export default withNumberPaginator;
