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
import { ProgressBar } from 'react-bootstrap';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { text2md, to_global_id as t } from 'common';
import environment from 'Environment';
import { Flex } from 'rebass';
import { Heading } from 'style-store';
import UserAwardPopover from 'components/UserAwardPopover';
import Constrained from 'components/Constrained';

import ProfileShowQuery from 'graphql/ProfileShowQuery';

import injectSaga from 'utils/injectSaga';
import ProfRow from './ProfRow';
import makeSelectProfilePage from './selectors';
import saga from './saga';
import messages from './messages';

function ProfilePage(props, context) {
  const _ = context.intl.formatMessage;
  return (
    <div>
      <Helmet>
        <title>{`Cindy - ${_(messages.heading)}`}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Constrained level={3}>
        <QueryRenderer
          environment={environment}
          component={() => <div />}
          query={ProfileShowQuery}
          variables={{ id: t('UserNode', props.match.params.id) }}
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
                      heading={_(messages.dateJoined)}
                      content={<div>{moment(U.dateJoined).format('llll')}</div>}
                    />
                    <ProfRow
                      heading={_(messages.lastLogin)}
                      content={<div>{moment(U.lastLogin).format('llll')}</div>}
                    />
                    <ProfRow
                      heading={_(messages.profile)}
                      content={
                        <div
                          style={{ overflow: 'auto' }}
                          dangerouslySetInnerHTML={{
                            __html: text2md(U.profile),
                          }}
                        />
                      }
                    />
                  </Flex>
                </div>
              );
            }
            return (
              <ProgressBar now={100} label={'Loading...'} striped active />
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

const mapStateToProps = createStructuredSelector({
  profilepage: makeSelectProfilePage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'profilepage', saga });

export default compose(withSaga, withConnect)(ProfilePage);
