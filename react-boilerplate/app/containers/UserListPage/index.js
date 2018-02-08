/**
 *
 * UserListPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { compose } from 'redux';
import { Heading } from 'style-store';
import Constrained from 'components/Constrained';

import UserFilterableList from './UserFilterableList';
import messages from './messages';

function UserListPage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <Constrained level={4}>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Heading>
        <FormattedMessage {...messages.header} />
        <span style={{ padding: '0 10px' }} />
      </Heading>
      <UserFilterableList
        order={[{ key: 'date_joined', asc: false }]}
        orderList={['date_joined']}
      />
    </Constrained>
  );
}

UserListPage.contextTypes = {
  intl: intlShape,
};

UserListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(UserListPage);
