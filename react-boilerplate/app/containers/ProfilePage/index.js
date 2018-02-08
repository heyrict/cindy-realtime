/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { QueryRenderer } from 'react-relay';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { to_global_id as t } from 'common';
import environment from 'Environment';
import { Heading } from 'style-store';
import Constrained from 'components/Constrained';
import LoadingDots from 'components/LoadingDots';
import ProfileNavbar from 'components/ProfileNavbar';

import ProfileShowQuery from 'graphql/ProfileShowQuery';

import injectSaga from 'utils/injectSaga';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import PuzzlesPanel from './PuzzlesPanel';
import StarsPanel from './StarsPanel';
import BookmarksPanel from './BookmarksPanel';
import ProfileDisplay from './ProfileDisplay';
import makeSelectProfilePage from './selectors';
import saga from './saga';
import messages from './messages';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };
    this.changeTab = (tab) => this.setState({ tabIndex: tab });
  }

  render() {
    const _ = this.context.intl.formatMessage;
    const userId = t('UserNode', this.props.match.params.id);
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
                    <ProfileNavbar
                      userId={parseInt(this.props.match.params.id, 10)}
                      onProfileClick={() => this.changeTab(0)}
                      onPuzzlesClick={() => this.changeTab(1)}
                      onStarsClick={() => this.changeTab(2)}
                      onBookmarksClick={() => this.changeTab(3)}
                      hideBookmark={
                        U.hideBookmark &&
                        t('UserNode', this.props.usernavbar.user.userId) !==
                          userId
                      }
                    />
                    {this.state.tabIndex === 0 && (
                      <ProfileDisplay
                        user={{ ...U, userId }}
                        currentUserId={t(
                          'UserNode',
                          this.props.usernavbar.user.userId
                        )}
                      />
                    )}
                    {this.state.tabIndex === 1 && (
                      <PuzzlesPanel userId={userId} />
                    )}
                    {this.state.tabIndex === 2 && (
                      <StarsPanel userId={userId} />
                    )}
                    {this.state.tabIndex === 3 && (
                      <BookmarksPanel
                        userId={userId}
                        currentUserId={t(
                          'UserNode',
                          this.props.usernavbar.user.userId
                        )}
                      />
                    )}
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
}

ProfilePage.contextTypes = {
  intl: intlShape,
};

ProfilePage.propTypes = {
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
