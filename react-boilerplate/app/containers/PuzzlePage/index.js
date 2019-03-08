/**
 *
 * PuzzlePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import injectSaga from 'utils/injectSaga';

import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Heading } from 'style-store';
import Constrained from 'components/Constrained';
import FilterableList from 'components/FilterableList';
import PuzzleList from 'components/PuzzleList';
import GoogleAd from 'components/GoogleAd';
import PuzzleNavbar from 'components/PuzzleNavbar';
import EventList from 'components/EventList';
import PuzzleActiveList from 'containers/PuzzleActiveList';
import { googleAdInfo, DEFAULT_TIMEZONE } from 'settings';

import titleMessages from 'components/TitleLabel/messages';
import messages from './messages';

const now = moment();

function PuzzlePage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <Constrained level={5} mb={2}>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Heading>
        <FormattedMessage {...messages.header} />
        <span style={{ padding: '0 10px' }} />
      </Heading>
      <PuzzleNavbar />
      <EventList
        variables={{
          orderBy: ['end_time'],
          endTime_Gt: now.utcOffset(DEFAULT_TIMEZONE).format(),
        }}
        itemsPerPage={10}
      />
      <PuzzleActiveList />
      <GoogleAd {...googleAdInfo.infieldAd} />
      <FilterableList
        component={PuzzleList}
        variables={{ status__gt: 0 }}
        order="-modified"
        orderList={['modified', 'starCount', 'starSum', 'commentCount']}
        filterList={[
          'title__contains',
          'content__contains',
          'solution__contains',
          {
            name: 'genre__exact',
            options: [
              {
                value: '0',
                label: <FormattedMessage {...titleMessages.classic} />,
              },
              {
                value: '1',
                label: <FormattedMessage {...titleMessages.twentyQuestions} />,
              },
              {
                value: '2',
                label: <FormattedMessage {...titleMessages.littleAlbat} />,
              },
              {
                value: '3',
                label: <FormattedMessage {...titleMessages.others} />,
              },
              {
                label: <FormattedMessage {...messages.all} />,
              },
            ],
          },
          {
            name: 'yami__exact',
            options: [
              {
                value: '0',
                label: <FormattedMessage {...titleMessages.none} />,
              },
              {
                value: '1',
                label: <FormattedMessage {...titleMessages.yami} />,
              },
              {
                value: '2',
                label: <FormattedMessage {...titleMessages.longtermYami} />,
              },
              {
                label: <FormattedMessage {...messages.all} />,
              },
            ],
          },
        ]}
        fetchPolicy="cache-and-network"
      />
    </Constrained>
  );
}

PuzzlePage.contextTypes = {
  intl: intlShape,
};

PuzzlePage.propTypes = {
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

export default compose(withConnect)(PuzzlePage);
