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
import { Helmet } from 'react-helmet';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Box } from 'rebass';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import 'react-select/dist/react-select.css';
import 'react-tippy/dist/tippy.css';
import 'datepicker-custom.css';
import 'tippy-custom.css';
import 'base.css';

import Chat from 'containers/Chat';
import Notifier from 'containers/Notifier';
import TopNavbar from 'containers/TopNavbar';
import WebSocketInterface from 'containers/WebSocketInterface';

import AwardApplicationPage from 'containers/AwardApplicationPage/Loadable';
import DashBoardPage from 'containers/DashBoardPage/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ProfilePage from 'containers/ProfilePage/Loadable';
import PuzzleAddPage from 'containers/PuzzleAddPage/Loadable';
import PuzzlePage from 'containers/PuzzlePage/Loadable';
import PuzzleShowPage from 'containers/PuzzleShowPage/Loadable';
import RulesPage from 'containers/RulesPage/Loadable';
import UserListPage from 'containers/UserListPage/Loadable';
import WikiPage from 'containers/WikiPage/Loadable';

import makeSelectChat from 'containers/Chat/selectors';
import { StartCountdown, changeTabularTab, pushWithLocale } from 'common';
import { domainFilter } from 'settings';

const BodyBox = styled(Box)`
  ${({ chatopen }) =>
    chatopen && '@media (max-width: 35.99em) { display: none; }'};
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
    if (typeof e.target.onclick !== 'function' && 'href' in attr) {
      const { selfDomain, url } = domainFilter(attr.href.value);
      if (selfDomain && e.button === 0 /* left cick */) {
        this.props.goto(url);
        e.preventDefault();
      }
    }
  }
  render() {
    const InnerRoutes = (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/dashboard" component={DashBoardPage} />
        <Route exact path="/rules" component={RulesPage} />
        <Route exact path="/puzzle" component={PuzzlePage} />
        <Route exact path="/puzzle/add" component={PuzzleAddPage} />
        <Route path="/puzzle/show/:id" component={PuzzleShowPage} />
        <Route exact path="/profile" component={UserListPage} />
        <Route exact path="/profile/award" component={AwardApplicationPage} />
        <Route path="/profile/show/:id" component={ProfilePage} />
        <Route path="/wiki/:id([\s\S]+)" component={WikiPage} />
      </Switch>
    );
    return (
      <div>
        <Helmet titleTemplate="%s - Cindy" defaultTitle="Cindy">
          <meta
            name="description"
            content="A lateral thinking salon for every one"
          />
        </Helmet>
        <Notifier />
        <WebSocketInterface />
        <TopNavbar />
        <Box
          w={this.props.chat.open ? [1, '250px', 0.3] : 0}
          height={this.state.height}
          hidden={!this.props.chat.open}
          style={{ position: 'fixed' }}
        >
          <Chat height={this.state.height - 50} />
        </Box>
        <BodyBox
          w={this.props.chat.open ? [0, 'calc(100% - 250px)', 0.7] : 1}
          ml={this.props.chat.open ? ['100%', '250px', '30%'] : 0}
          height={this.state.height}
          chatopen={this.props.chat.open}
        >
          <Switch>
            {InnerRoutes}
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
  mapDispatchToProps,
);

export default compose(
  withRouter,
  withConnect,
)(App);
