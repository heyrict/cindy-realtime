/**
 *
 * AwardApplicationPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { to_global_id as t } from 'common';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { Heading } from 'style-store';

import AwardApplicationList from 'components/AwardApplicationList';
import Constrained from 'components/Constrained';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';

import AwardApplicationForm from './AwardApplicationForm';
import messages from './messages';

function AwardApplicationPage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <Constrained level={4}>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Heading>
        <FormattedMessage {...messages.header} />
      </Heading>
      {props.currentUser.user.userId && <AwardApplicationForm />}
      <AwardApplicationList
        variables={{ orderBy: ['status', '-id'] }}
        currentUserId={t('UserNode', props.currentUser.user.userId || -1)}
      />
    </Constrained>
  );
}

AwardApplicationPage.propTypes = {
  currentUser: PropTypes.shape({
    user: PropTypes.shape({
      userId: PropTypes.number,
    }),
  }),
};

AwardApplicationPage.contextTypes = {
  intl: intlShape,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectUserNavbar(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(AwardApplicationPage);
