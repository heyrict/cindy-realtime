/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage, intlShape } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { to_global_id as t, text2desc, getQueryStr, setQueryStr } from 'common';
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
import { makeSelectLocation } from 'containers/App/selectors';
import { nAlert } from 'containers/Notifier/actions';
import ProfileDisplay from './ProfileDisplay';
import saga from './saga';
import messages from './messages';
import { TAB_NAMES } from './constants';

function ProfilePage(props, context) {
  const _ = context.intl.formatMessage;
  const userId = t('UserNode', props.match.params.id);
  const { loading, error, user } = props.data;

  if (loading) {
    return (
      <Helmet>
        <title>{`Cindy - ${_(messages.title)}`}</title>
        <meta
          name="description"
          content={
            (user && user.profile && text2desc(user.profile)) ||
            _(messages.description)
          }
        />
      </Helmet>
    );
  } else if (error) {
    props.alert(error);
    return <LoadingDots />;
  }

  const query = getQueryStr(props.location.search);
  const currentTab = query.display || TAB_NAMES.profile;
  const changeTab = (display) => {
    props.goto(setQueryStr({ ...query, display }));
  };
  const hideBookmark =
    user.hideBookmark && t('UserNode', props.usernavbar.user.userId) !== userId;

  return (
    <Constrained level={3}>
      <Helmet>
        <title>{`${_(messages.heading, {
          nickname: user.nickname,
        })} - Cindy`}</title>
        <meta name="description" content={_(messages.description)} />
      </Helmet>
      <Heading>
        <FormattedMessage
          {...messages.heading}
          values={{ nickname: user.nickname }}
        />
      </Heading>
      <ProfileNavbar
        userId={parseInt(props.match.params.id, 10)}
        onProfileClick={() => changeTab(TAB_NAMES.profile)}
        onPuzzlesClick={() => changeTab(TAB_NAMES.puzzle)}
        onStarsClick={() => changeTab(TAB_NAMES.star)}
        onBookmarksClick={() => changeTab(TAB_NAMES.bookmark)}
        hideBookmark={hideBookmark}
      />
      {currentTab === TAB_NAMES.profile && (
        <ProfileDisplay
          user={user}
          userId={userId}
          currentUserId={t('UserNode', props.usernavbar.user.userId)}
        />
      )}
      {currentTab === TAB_NAMES.puzzle && (
        <FilterableList
          component={PuzzleList}
          variables={{ count: 10, user: userId }}
          order={[{ key: 'modified', asc: false }]}
          orderList={['modified', 'starCount', 'starSum']}
          queryKey="puzzlePage"
        />
      )}
      {currentTab === TAB_NAMES.star && (
        <FilterableList
          component={StarList}
          variables={{ user: userId }}
          order={[{ key: 'value', asc: false }]}
          orderList={['id', 'value']}
        />
      )}
      {currentTab === TAB_NAMES.bookmark &&
        !hideBookmark && (
          <FilterableList
            component={BookmarkList}
            variables={{ user: userId }}
            order={[{ key: 'value', asc: false }]}
            orderList={['id', 'value']}
            userId={userId}
            currentUserId={t('UserNode', props.usernavbar.user.userId)}
          />
        )}
    </Constrained>
  );
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
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }),
  goto: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  usernavbar: makeSelectUserNavbar(),
  location: makeSelectLocation(),
});

const mapDispatchToProps = (dispatch) => ({
  goto: (path) => dispatch(push(path)),
  alert: (msg) => dispatch(nAlert(message)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'profilepage', saga });

const withUser = graphql(ProfileShowQuery, {
  options: ({ match: { params: { id } } }) => ({
    variables: { id: t('UserNode', id) },
  }),
});

export default compose(withUser, withSaga, withConnect)(ProfilePage);
