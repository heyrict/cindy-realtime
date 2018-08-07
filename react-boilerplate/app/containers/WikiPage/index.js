/**
 *
 * WikiPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { intlShape } from 'react-intl';
import { compose } from 'redux';
import { withLocale } from 'common';

import { Flex, Box } from 'rebass';
import { Heading } from 'style-store';
import Constrained from 'components/Constrained';

import WikiContainer from './WikiContainer';
import messages from './messages';

function WikiPage(props, context) {
  const _ = context.intl.formatMessage;
  const title = _(messages.title);
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Cindy Wiki" />
      </Helmet>
      <Constrained level={5}>
        <Heading>{title}</Heading>
        <Flex flexWrap="wrap">
          <Box w={[1, 1 / 3, '200px']} p={1}>
            <WikiContainer path={withLocale('/menu', 2).substr(1)} />
          </Box>
          <Box w={[1, 2 / 3, 'calc(100% - 200px)']} p={1}>
            <WikiContainer path={props.match.params.id} />
          </Box>
        </Flex>
      </Constrained>
    </div>
  );
}

WikiPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

WikiPage.contextTypes = {
  intl: intlShape,
};

export default WikiPage;
