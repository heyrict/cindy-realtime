/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { QueryRenderer } from 'react-relay';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { to_global_id as t } from 'common';
import environment from 'Environment';
import { Flex } from 'rebass';
import { Heading } from 'style-store';
import UserAwardPopover from 'components/UserAwardPopover';
import Constrained from 'components/Constrained';
import LoadingDots from 'components/LoadingDots';

import ProfileShowQuery from 'graphql/ProfileShowQuery';

import injectSaga from 'utils/injectSaga';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import ProfRow from './ProfRow';
import ProfileRow from './ProfileRow';
import AwardSwitch from './AwardSwitch';
import makeSelectProfilePage from './selectors';
import saga from './saga';
import messages from './messages';

function ProfilePage(props, context) {
  const _ = context.intl.formatMessage;
  const userId = t('UserNode', props.match.params.id);
  return (
    <div>
      <Helmet>
        <title>{`Cindy - ${_(messages.title)}`}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Constrained level={3}>
        <QueryRenderer
          environment={environment}
          query={ProfileShowQuery}
          variables={{ id: userId }}
          render={(raw) => {
            const error = raw.error;
            const data = raw.props;
            if (error) {
              return <div>{error.message}</div>;
            } else if (data) {
              const U = data.user;
              return (
                <div>
                  <Helmet>
                    <title>{`Cindy - ${_(messages.heading, {
                      nickname: U.nickname,
                    })}`}</title>
                  </Helmet>
                  <Heading>
                    <FormattedMessage
                      {...messages.heading}
                      values={{ nickname: U.nickname }}
                    />
                  </Heading>
                  <Flex wrap>
                    <ProfRow
                      heading={_(messages.nickname)}
                      content={
                        <div>
                          {U.nickname}
                          {U.userawardSet.edges.map((edge) => (
                            <UserAwardPopover
                              userAward={edge.node}
                              placement="bottom"
                              key={edge.node.id}
                              style={{
                                color: 'darkslategray',
                                padding: '0 3px',
                              }}
                            />
                          ))}
                        </div>
                      }
                    />
                    <ProfRow
                      heading={_(messages.puzzleCount)}
                      content={U.puzzleCount}
                    />
                    <ProfRow
                      heading={_(messages.quesCount)}
                      content={U.quesCount}
                    />
                    <ProfRow
                      heading={_(messages.goodQuesCount)}
                      content={U.goodQuesCount}
                    />
                    <ProfRow
                      heading={_(messages.trueQuesCount)}
                      content={U.trueQuesCount}
                    />
                    <ProfRow
                      heading={_(messages.commentCount)}
                      content={U.commentCount}
                    />
                    <ProfRow
                      heading={_(messages.dateJoined)}
                      content={
                        <div>
                          {moment(U.dateJoined).format('YYYY-MM-DD HH:mm')}
                        </div>
                      }
                    />
                    <ProfRow
                      heading={_(messages.lastLogin)}
                      content={
                        <div>
                          {moment(U.lastLogin).format('YYYY-MM-DD HH:mm')}
                        </div>
                      }
                    />
                    {userId === t('UserNode', props.usernavbar.user.userId) && (
                      <AwardSwitch
                        currentAwardId={
                          U.currentAward ? U.currentAward.id : null
                        }
                        userawardSet={U.userawardSet}
                      />
                    )}
                    <ProfileRow userId={userId} profile={U.profile} />
                  </Flex>
                </div>
              );
            }
            return (
              <div style={{ paddingTop: '100px' }}>
                <LoadingDots />
              </div>
            );
          }}
        />
      </Constrained>
    </div>
  );
}

ProfilePage.contextTypes = {
  intl: intlShape,
};

ProfilePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  usernavbar: PropTypes.shape({
    user: PropTypes.shape({
      userId: PropTypes.number,
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

const mapStateToProps = createStructuredSelector({
  profilepage: makeSelectProfilePage(),
  usernavbar: makeSelectUserNavbar(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'profilepage', saga });

export default compose(withSaga, withConnect)(ProfilePage);
