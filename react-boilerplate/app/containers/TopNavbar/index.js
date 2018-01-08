/**
 *
 * TopNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { MenuItem, Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import NavbarUserDropdown from 'containers/NavbarUserDropdown';

function TopNavbar() {
  return (
    <Navbar fixedTop collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>Cindy</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer exact to="/">
            <NavItem eventKey={1}>{gettext('Homepage')}</NavItem>
          </LinkContainer>
          <NavDropdown
            title={gettext('Puzzle')}
            eventKey={3}
            id="mainnavbar-puzzle-dropdown"
          >
            <LinkContainer exact to="/puzzle">
              <MenuItem eventKey="3.1">{gettext('All Puzzles')}</MenuItem>
            </LinkContainer>
            <LinkContainer exact to="/puzzle/add">
              <MenuItem eventKey="3.2">{gettext('New Puzzle')}</MenuItem>
            </LinkContainer>
          </NavDropdown>
          <LinkContainer exact to="/profile">
            <NavItem>{gettext('User List')}</NavItem>
          </LinkContainer>
        </Nav>
        <NavbarUserDropdown />
      </Navbar.Collapse>
    </Navbar>
  );
}

TopNavbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(TopNavbar);
