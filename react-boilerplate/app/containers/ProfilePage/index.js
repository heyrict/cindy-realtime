/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { to_global_id as t } from 'common';
import { Heading } from 'style-store';
import Constrained from 'components/Constrained';
import LoadingDots from 'components/LoadingDots';
import ProfileNavbar from 'components/ProfileNavbar';

import { graphql } from 'react-apollo';
import ProfileShowQuery from 'graphql/ProfileShowQuery';
import FilterableList from 'components/FilterableList';
import PuzzleList from 'components/PuzzleList';
import BookmarkList from 'components/BookmarkList';
import StarList from 'components/StarList';

import injectSaga from 'utils/injectSaga';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import ProfileDisplay from './ProfileDisplay';
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
    const { loading, error, user } = this.props.data;
    if (loading) {
      return (
        <Helmet>
          <title>{`Cindy - ${_(messages.title)}`}</title>
          <meta name="description" content={_(messages.description)} />
        </Helmet>
      );
    } else if (error) {
      console.log(error);
      return <LoadingDots />;
    }
    return (
      <Constrained level={3}>
        <Helmet>
          <title>
            {`Cindy - ${_(messages.heading, { nickname: user.nickname })}`}
          </title>
        </Helmet>
        <Heading>
          <FormattedMessage
            {...messages.heading}
            values={{ nickname: user.nickname }}
          />
        </Heading>
        <ProfileNavbar
          userId={parseInt(this.props.match.params.id, 10)}
          onProfileClick={() => this.changeTab(0)}
          onPuzzlesClick={() => this.changeTab(1)}
          onStarsClick={() => this.changeTab(2)}
          onBookmarksClick={() => this.changeTab(3)}
          hideBookmark={
            user.hideBookmark &&
            t('UserNode', this.props.usernavbar.user.userId) !== userId
          }
        />
        {this.state.tabIndex === 0 && (
          <ProfileDisplay
            user={user}
            userId={userId}
            currentUserId={t('UserNode', this.props.usernavbar.user.userId)}
          />
        )}
        {this.state.tabIndex === 1 && (
          <FilterableList
            component={PuzzleList}
            variables={{ count: 10, user: userId }}
            order={[{ key: 'modified', asc: false }]}
            orderList={['modified', 'starCount', 'starSum']}
          />
        )}
        {this.state.tabIndex === 2 && (
          <FilterableList
            component={StarList}
            variables={{ user: userId }}
            order={[{ key: 'id', asc: false }]}
            orderList={['id']}
          />
        )}
        {this.state.tabIndex === 3 && (
          <FilterableList
            component={BookmarkList}
            variables={{ user: userId }}
            order={[{ key: 'id', asc: false }]}
            orderList={['id']}
            userId={userId}
            currentUserId={t('UserNode', this.props.usernavbar.user.userId)}
          />
        )}
      </Constrained>
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
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    user: PropTypes.object,
  }),
};

const mapStateToProps = createStructuredSelector({
  usernavbar: makeSelectUserNavbar(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'profilepage', saga });

const withUser = graphql(ProfileShowQuery, {
  options: ({ match: { params: { id } } }) => ({
    variables: { id: t('UserNode', id) },
  }),
});

export default compose(withUser, withSaga, withConnect)(ProfilePage);
