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
import { Flex, Box } from 'rebass';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import WebSocketInterface from 'containers/WebSocketInterface';
import Notifier from 'containers/Notifier';
import TopNavbar from 'containers/TopNavbar';
import HomePage from 'containers/HomePage/Loadable';
import PuzzlePage from 'containers/PuzzlePage/Loadable';
import PuzzleAddPage from 'containers/PuzzleAddPage/Loadable';
import PuzzleShowPage from 'containers/PuzzleShowPage';
import ProfilePage from 'containers/ProfilePage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Chat from 'containers/Chat';
import makeSelectChat from 'containers/Chat/selectors';
import common from 'common';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/semantic.min.css';

const EasingBox = styled(Box)`
  height: ${(props) => props.height - 50}px;
  overflow-y: auto;
  @media (max-width: 720px) {
    display: ${(props) =>
      props.w === 0 || props.w[0] === 0 ? 'none' : 'block'};
  }
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.resize = this.resize.bind(this);
  }
  componentWillMount() {
    this.resize();
  }
  componentDidMount() {
    this.countdownHdl = common.StartCountdown();
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.clearInterval(this.countdownHdl);
    window.removeEventListener('resize', this.resize);
  }
  resize() {
    const height = window.innerHeight || document.documentElement.clientHeight;
    this.setState({ height });
  }
  render() {
    return (
      <div>
        <Notifier />
        <WebSocketInterface />
        <TopNavbar />
        <Flex>
          <EasingBox
            w={this.props.chat.open ? [1, 0.382, 0.3] : 0}
            height={this.state.height}
            hidden={!this.props.chat.open}
          >
            <Chat height={this.state.height - 50} />
          </EasingBox>
          <EasingBox
            w={this.props.chat.open ? [0, 0.618, 0.7] : 1}
            height={this.state.height}
          >
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/puzzle" component={PuzzlePage} />
              <Route exact path="/puzzle/add" component={PuzzleAddPage} />
              <Route path="/puzzle/show/:id" component={PuzzleShowPage} />
              <Route path="/profile/show/:id" component={ProfilePage} />
              <Route component={NotFoundPage} />
            </Switch>
          </EasingBox>
        </Flex>
      </div>
    );
  }
}

App.propTypes = {
  chat: PropTypes.shape({
    open: PropTypes.bool.isRequired,
  }),
};

const mapStateToProps = createStructuredSelector({
  chat: makeSelectChat(),
});

export default withRouter(connect(mapStateToProps)(App));
