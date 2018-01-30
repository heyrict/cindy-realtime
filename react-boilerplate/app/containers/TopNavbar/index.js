/**
 *
 * TopNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector, createSelector } from 'reselect';

import { Box, ButtonTransparent } from 'rebass';
import { Navbar, ImgSm } from 'style-store';
import MenuNavbar from 'components/MenuNavbar';
import UserNavbar from 'containers/UserNavbar';
import styled from 'styled-components';
import chatImg from 'images/chat.svg';
import memoImg from 'images/memo.svg';
import loginImg from 'images/login.svg';
import menuImg from 'images/menu.svg';

import { toggleChat, toggleMemo } from 'containers/Chat/actions';
import { selectPuzzleShowPageDomain } from 'containers/PuzzleShowPage/selectors';

import injectSaga from 'utils/injectSaga';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { toggleSubNav } from './actions';
import makeSelectTopNavbar from './selectors';
import saga from './saga';

const NavbarBtn = styled(ButtonTransparent)`
  max-height: 50px;
  width: 100%;
  padding: 10px;
  margin: 0;
`;

const NavbarBtnMsg = styled.span`
  max-height: 30px;
  padding: 10px;
  font-size: 1.5em;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

function TopNavbar(props) {
  function toggle(navName, set = false) {
    if (set === false) {
      props.toggleSubNav(props.topnavbar.subnav === navName ? null : navName);
      return;
    }
    props.toggleSubNav(navName);
  }

  return (
    <Navbar mx={-2}>
      <Box w={1 / 3} m="auto">
        <NavbarBtn onClick={() => toggle('menu')}>
          <ImgSm src={menuImg} alt="menu" />
          <NavbarBtnMsg>
            <FormattedMessage {...messages.menu} />
          </NavbarBtnMsg>
        </NavbarBtn>
        <MenuNavbar open={props.topnavbar.subnav === 'menu'} />
      </Box>
      <Box w={1 / 3} m="auto">
        <NavbarBtn onClick={() => props.dispatch(toggleChat())}>
          <ImgSm src={chatImg} alt="chat" />
          <NavbarBtnMsg>
            <FormattedMessage {...messages.chat} />
          </NavbarBtnMsg>
        </NavbarBtn>
      </Box>
      {props.puzzle &&
        props.puzzle.memo && (
          <Box w={1 / 3} m="auto">
            <NavbarBtn onClick={() => props.dispatch(toggleMemo())}>
              <ImgSm src={memoImg} alt="memo" />
              <NavbarBtnMsg>
                <FormattedMessage {...messages.memo} />
              </NavbarBtnMsg>
            </NavbarBtn>
          </Box>
        )}
      <Box w={1 / 3} m="auto">
        <NavbarBtn onClick={() => toggle('user')}>
          <ImgSm src={loginImg} alt="profile" />
          <NavbarBtnMsg>
            <FormattedMessage {...messages.profile} />
          </NavbarBtnMsg>
        </NavbarBtn>
        <UserNavbar open={props.topnavbar.subnav === 'user'} />
      </Box>
    </Navbar>
  );
}

TopNavbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  toggleSubNav: PropTypes.func.isRequired,
  topnavbar: PropTypes.shape({
    subnav: PropTypes.string,
  }),
  puzzle: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  topnavbar: makeSelectTopNavbar(),
  puzzle: createSelector(selectPuzzleShowPageDomain, (substate) =>
    substate.get('puzzle')
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    toggleSubNav: (subnav) => dispatch(toggleSubNav(subnav)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'topNavBar', saga });

export default compose(withSaga, withConnect)(TopNavbar);
