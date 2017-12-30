import React from "react";
import { connect } from "react-redux";
import { MenuItem, Navbar, Nav, NavItem, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { LoginMenuItem, LogoutMenuItem } from "./AuthForm.jsx";

const mapStateToProps = state => ({
  user: state.currentUser,
  onlineViewerCount: state.onlineViewerCount
});

class UserDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  render() {
    const loggedInTitle = interpolate(gettext("Welcome, %s"), [
        this.props.user.nickname
      ]),
      notLoggedInTitle = gettext("Hello, guest!"),
      onlineViewerNumTitle =
        gettext("Online users:") + " " + this.props.onlineViewerCount;
    return (
      <Nav pullRight>
        {this.props.user.userId ? (
          <NavDropdown
            eventKey={0}
            title={this.state.hover ? onlineViewerNumTitle : loggedInTitle}
            id="mainnavbar-user-dropdown"
            onMouseEnter={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
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
            title={this.state.hover ? onlineViewerNumTitle : notLoggedInTitle}
            id="mainnavbar-user-dropdown"
            onMouseEnter={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
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
