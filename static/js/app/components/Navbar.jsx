import React from "react";
import { MenuItem, Navbar, Nav, NavItem, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { LoginMenuItem, LogoutMenuItem } from "./AuthForm.jsx";
import { NavbarUserDropdown } from "./NavbarUserDropdown.jsx";

export const TopNavbar = () => (
  <Navbar fixedTop collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>Cindy</Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer exact to="/">
          <NavItem eventKey={1}>{gettext("Homepage")}</NavItem>
        </LinkContainer>
        <NavDropdown
          title={gettext("Puzzle")}
          eventKey={3}
          id="mainnavbar-puzzle-dropdown"
        >
          <LinkContainer exact to="/puzzle">
            <MenuItem eventKey="3.1">{gettext("All Puzzles")}</MenuItem>
          </LinkContainer>
          <LinkContainer exact to="/puzzle/add">
            <MenuItem eventKey="3.2">{gettext("New Puzzle")}</MenuItem>
          </LinkContainer>
        </NavDropdown>
        <LinkContainer exact to="/profile">
          <NavItem>{gettext("User List")}</NavItem>
        </LinkContainer>
      </Nav>
      <NavbarUserDropdown />
    </Navbar.Collapse>
  </Navbar>
);
