/**
 *
 * DashBoardPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Flex, Box } from 'rebass';
import { Heading, ImgXs as Img, Button } from 'style-store';
import { to_global_id as t, pushWithLocale } from 'common';
import { FormattedMessage, intlShape } from 'react-intl';
import { compose } from 'redux';
import moment from 'moment';
import { DEFAULT_TIMEZONE } from 'settings';

import { createSelector, createStructuredSelector } from 'reselect';
import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';

import plus from 'images/plus-light.svg';
import chevronRight from 'images/chevron-right.svg';
import AwardApplicationList from 'components/AwardApplicationList';
import ScheduleList from 'components/ScheduleList';
import Constrained from 'components/Constrained';
import ScheduleAddItem from 'containers/ScheduleAddForm/ScheduleAddItem';
import HelpPopper from 'components/HelpPopper';

import messages from './messages';
import Board from './Board';
import PuzzleStaticChart from './PuzzleStaticChart';

const now = moment();

function DashBoardPage(props, context) {
  const currentUserId = t('UserNode', props.currentUserId || -1);
  const _ = context.intl.formatMessage;
  return (
    <div>
      <Helmet>
        <title>{_(messages.title)}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Constrained level={5}>
        <Heading>
          <FormattedMessage {...messages.heading} />
        </Heading>
        <Flex w={1} flexWrap="wrap">
          <Box w={[1, 1, 1 / 2]}>
            <Board
              title={
                <span>
                  <FormattedMessage {...messages.schedule} />
                  <HelpPopper messageId="dashboard_schedule" />
                  <ScheduleAddItem bg="transparent" style={{ float: 'right' }}>
                    <Img alt="plus" src={plus} />
                  </ScheduleAddItem>
                </span>
              }
              content={
                <ScheduleList
                  variables={{
                    orderBy: 'scheduled',
                    scheduled_Gt: now.utcOffset(DEFAULT_TIMEZONE).format(),
                  }}
                  fetchPolicy="cache-and-network"
                />
              }
            />
          </Box>
          {props.currentUserId && (
            <Box w={[1, 1, 1 / 2]}>
              <Board
                title={
                  <span>
                    <FormattedMessage {...messages.awardApplications} />
                    <Button
                      bg="transparent"
                      style={{ float: 'right' }}
                      onClick={() => props.goto('/profile/award')}
                    >
                      <Img alt="go" src={chevronRight} />
                    </Button>
                  </span>
                }
                content={
                  <AwardApplicationList
                    variables={{
                      orderBy: ['-id'],
                      applier: currentUserId || t('UserNode', -1),
                      count: 5,
                    }}
                    currentUserId={currentUserId || t('UserNode', -1)}
                    allowPagination={false}
                  />
                }
              />
            </Box>
          )}
          <Box w={[1, 1, 1 / 2]} style={{ overflow: 'scroll' }}>
            <Board
              title={<FormattedMessage {...messages.puzzleCountChart} />}
              content={
                <PuzzleStaticChart
                  currentUserId={currentUserId || t('UserNode', -1)}
                />
              }
            />
          </Box>
        </Flex>
      </Constrained>
    </div>
  );
}

DashBoardPage.propTypes = {
  goto: PropTypes.func.isRequired,
  currentUserId: PropTypes.number,
};

DashBoardPage.contextTypes = {
  intl: intlShape,
};

const mapStateToProps = createStructuredSelector({
  currentUserId: createSelector(selectUserNavbarDomain, (usernavbar) =>
    usernavbar.getIn(['user', 'userId']),
  ),
});

const mapDispatchToProps = (dispatch) => ({
  goto: (url) => dispatch(pushWithLocale(url)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(DashBoardPage);
