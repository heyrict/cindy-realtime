/**
 *
 * AwardApplicationPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { Heading } from 'style-store';

import messages from './messages';

function AwardApplicationPage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <div>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Heading>
        <FormattedMessage {...messages.header} />
      </Heading>
    </div>
  );
}

AwardApplicationPage.contextTypes = {
  intl: intlShape,
};

export default AwardApplicationPage;
