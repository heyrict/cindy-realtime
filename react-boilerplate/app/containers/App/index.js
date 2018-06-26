/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Box } from 'rebass';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import WebSocketInterface from 'containers/WebSocketInterface';
import Notifier from 'containers/Notifier';
import TopNavbar from 'containers/TopNavbar';
import HomePage from 'containers/HomePage/Loadable';
import RulesPage from 'containers/RulesPage/Loadable';
import PuzzlePage from 'containers/PuzzlePage/Loadable';
import PuzzleAddPage from 'containers/PuzzleAddPage/Loadable';
import PuzzleShowPage from 'containers/PuzzleShowPage/Loadable';
import ProfilePage from 'containers/ProfilePage/Loadable';
import UserListPage from 'containers/UserListPage/Loadable';
import AwardApplicationPage from 'containers/AwardApplicationPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Chat from 'containers/Chat';
import makeSelectChat from 'containers/Chat/selectors';
import { StartCountdown, changeTabularTab, pushWithLocale } from 'common';
import { domainFilter } from 'settings';

const BodyBox = styled(Box)`
  ${({ chatopen }) =>
    chatopen && '@media (max-width: 31.99em) { display: none; }'};
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.resize = this.resize.bind(this);
    this.eventDelegation = this.eventDelegation.bind(this);
  }
  componentWillMount() {
    this.resize();
  }
  componentDidMount() {
    this.countdownHdl = StartCountdown();
    window.addEventListener('resize', this.resize);
    window.addEventListener('click', this.eventDelegation);
  }
  componentWillUnmount() {
    window.clearInterval(this.countdownHdl);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('click', this.eventDelegation);
  }
  resize() {
    const height = window.innerHeight || document.documentElement.clientHeight;
    this.setState({ height });
  }
  eventDelegation(e) {
    const attr = e.target.attributes;
    if ('data-toggle' in attr && 'data-target' in attr) {
      if (attr['data-toggle'].value === 'tab') {
        changeTabularTab(attr['data-target'].value.replace(/^#/, ''));
      }
    }
    if ('href' in attr) {
      const { selfDomain, url } = domainFilter(attr.href.value);
      if (selfDomain && e.button === 0 /* left cick */) {
        this.props.goto(url);
        e.preventDefault();
      }
    }
  }
  render() {
    const tp = (path, locale) => (locale ? `/${locale}${path}` : path);
    const InnerRoutes = (locale) => (
      <Switch>
        <Route exact path={tp('/', locale)} component={HomePage} />
        <Route exact path={tp('/rules', locale)} component={RulesPage} />
        <Route exact path={tp('/puzzle', locale)} component={PuzzlePage} />
        <Route
          exact
          path={tp('/puzzle/add', locale)}
          component={PuzzleAddPage}
        />
        <Route
          path={tp('/puzzle/show/:id', locale)}
          component={PuzzleShowPage}
        />
        <Route exact path={tp('/profile', locale)} component={UserListPage} />
        <Route
          exact
          path={tp('/profile/award', locale)}
          component={AwardApplicationPage}
        />
        <Route path={tp('/profile/show/:id', locale)} component={ProfilePage} />
      </Switch>
    );
    return (
      <div>
        <Notifier />
        <WebSocketInterface />
        <TopNavbar />
        <Box
          w={this.props.chat.open ? [1, 0.38, 0.3] : 0}
          height={this.state.height}
          hidden={!this.props.chat.open}
          style={{ position: 'fixed' }}
        >
          <Chat height={this.state.height - 50} />
        </Box>
        <BodyBox
          w={this.props.chat.open ? [0, 0.62, 0.7] : 1}
          ml={this.props.chat.open ? ['100%', '38%', '30%'] : 0}
          height={this.state.height}
          chatopen={this.props.chat.open}
        >
          <Switch>
            {InnerRoutes()}
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </BodyBox>
      </div>
    );
  }
}

App.propTypes = {
  chat: PropTypes.shape({
    open: PropTypes.string,
  }),
  goto: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  goto: (url) => dispatch(pushWithLocale(url)),
});

const mapStateToProps = createStructuredSelector({
  chat: makeSelectChat(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withRouter,
  withConnect
)(App);
