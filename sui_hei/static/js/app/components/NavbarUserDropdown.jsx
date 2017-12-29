import React from "react";
import { connect } from "react-redux";
import { MenuItem, Navbar, Nav, NavItem, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { LoginMenuItem, LogoutMenuItem } from "./AuthForm.jsx";

const mapStateToProps = state => ({
  user: state.currentUser
});

class UserDropDown extends React.Component {
  render() {
    return (
      <Nav pullRight>
        {this.props.user.userId ? (
          <NavDropdown
            eventKey={0}
            title={interpolate(gettext("Welcome, %s"), [
              this.props.user.nickname
            ])}
            id="mainnavbar-user-dropdown"
          >
            <LinkContainer to={"/profile/" + window.django.user_id}>
              <MenuItem eventKey={0.3}>{gettext("My Profile")}</MenuItem>
            </LinkContainer>
            <LinkContainer to="/logout">
              <LogoutMenuItem eventKey={0.4}>
                {gettext("Logout")}
              </LogoutMenuItem>
            </LinkContainer>
          </NavDropdown>
        ) : (
          <NavDropdown
            eventKey={0}
            title={gettext("Hello, guest!")}
            id="mainnavbar-user-dropdown"
          >
            <LoginMenuItem eventKey={0.1}>{gettext("Login")}</LoginMenuItem>
            <LinkContainer to="/register">
              <MenuItem eventKey={0.2}>{gettext("Register")}</MenuItem>
            </LinkContainer>
          </NavDropdown>
        )}
      </Nav>
    );
  }
}

export const NavbarUserDropdown = connect(mapStateToProps)(UserDropDown);
