/**
 *
 * RulesPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import { text2md } from 'common';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import Constrained from 'components/Constrained';

import messages from './messages';

function RulesPage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <div>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Constrained level={2}>
        <FormattedMessage {...messages.rules}>
          {(msg) => <div dangerouslySetInnerHTML={{ __html: text2md(msg) }} />}
        </FormattedMessage>
      </Constrained>
    </div>
  );
}

RulesPage.contextTypes = {
  intl: intlShape,
};

RulesPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(RulesPage);
