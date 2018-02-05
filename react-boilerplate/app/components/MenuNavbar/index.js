/**
 *
 * MenuNavbar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { RouterLink, SubNavbar } from 'style-store';
import { NavLink, Group, Button, ButtonOutline } from 'rebass';
import SponsersMenuItem from 'containers/SponsersMenuItem';

import { FormattedMessage } from 'react-intl';
import { changeLocale } from 'containers/LanguageProvider/actions';
import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import messages from './messages';

const StyledButton = styled(Button)`
  &:hover {
    background-color: #67a200;
  }
  background-color: #679615;
`;

const StyledButtonOutline = styled(ButtonOutline)`
  &:hover {
    background-color: #67a200;
  }
  background-color: transparent;
  color: #679615;
`;

const GroupButton = ({ on, ...props }) =>
  on === true ? (
    <StyledButton {...props} />
  ) : (
    <StyledButtonOutline {...props} />
  );

GroupButton.propTypes = {
  on: PropTypes.bool,
};

function MenuNavbar(props) {
  return (
    <SubNavbar mx={-2} style={{ display: props.open ? 'block' : 'none' }}>
      <RouterLink to="/" tabIndex="0">
        <NavLink is="span">
          <FormattedMessage {...messages.hp} />
        </NavLink>
      </RouterLink>
      <RouterLink to="/puzzle">
        <NavLink is="span">
          <FormattedMessage {...messages.puzzle} />
        </NavLink>
      </RouterLink>
      <RouterLink to="/puzzle/add">
        <NavLink is="span">
          <FormattedMessage {...messages.puzzleAdd} />
        </NavLink>
      </RouterLink>
      <RouterLink to="//wiki3.jp/cindy-lat">
        <NavLink is="span">
          <FormattedMessage {...messages.wiki} />
        </NavLink>
      </RouterLink>
      <SponsersMenuItem>
        <FormattedMessage {...messages.sponsers} />
      </SponsersMenuItem>
      <RouterLink to="/rules">
        <NavLink is="span">
          <FormattedMessage {...messages.rules} />
        </NavLink>
      </RouterLink>
      <NavLink p={5}>
        <Group>
          <GroupButton
            on={props.locale === 'en'}
            px={12}
            py={12}
            onClick={() => props.dispatch(changeLocale('en'))}
          >
            en
          </GroupButton>
          <GroupButton
            on={props.locale === 'ja'}
            px={12}
            py={12}
            onClick={() => props.dispatch(changeLocale('ja'))}
          >
            ja
          </GroupButton>
        </Group>
      </NavLink>
    </SubNavbar>
  );
}

MenuNavbar.propTypes = {
  dispatch: PropTypes.func,
  open: PropTypes.bool,
  locale: PropTypes.string,
};

const mapStateToProps = createSelector(makeSelectLocale(), (locale) => ({
  locale,
}));

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuNavbar);
