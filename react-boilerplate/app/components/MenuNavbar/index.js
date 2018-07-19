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
import { NavLink, RouterLink, SubNavbar, ImgSm } from 'style-store';
import { Group, Button, ButtonOutline } from 'rebass';
import SponsersMenuItem from 'containers/SponsersMenuItem';
import { withLocale } from 'common';

import { FormattedMessage } from 'react-intl';
import githubMark from 'images/GitHub-Mark.svg';
import twitterMark from 'images/Twitter_Social_Icon_Circle_Color.svg';
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
    <SubNavbar w={1} style={{ display: props.open ? 'block' : 'none' }}>
      <RouterLink to={withLocale('/')} tabIndex="0">
        <NavLink is="span">
          <FormattedMessage {...messages.hp} />
        </NavLink>
      </RouterLink>
      <RouterLink to={withLocale('/puzzle')}>
        <NavLink is="span">
          <FormattedMessage {...messages.puzzle} />
        </NavLink>
      </RouterLink>
      <RouterLink to={withLocale('/puzzle/add')}>
        <NavLink is="span">
          <FormattedMessage {...messages.puzzleAdd} />
        </NavLink>
      </RouterLink>
      <RouterLink to={withLocale('/dashboard')}>
        <NavLink is="span">
          <FormattedMessage {...messages.dashboard} />
          <sup>
            <span
              style={{
                borderRadius: '10px',
                background: '#bd3612',
                color: 'blanchedalmond',
                padding: '0 2px',
              }}
            >
              new
            </span>
          </sup>
        </NavLink>
      </RouterLink>
      <NavLink is="span">
        <a
          target="_blank"
          href="//wiki3.jp/cindy-lat"
          style={{ color: '#002731' }}
        >
          <FormattedMessage {...messages.wiki} />
        </a>
      </NavLink>
      <SponsersMenuItem>
        <FormattedMessage {...messages.sponsers} />
      </SponsersMenuItem>
      <RouterLink to={withLocale('/rules')}>
        <NavLink is="span">
          <FormattedMessage {...messages.rules} />
        </NavLink>
      </RouterLink>
      <NavLink p={1}>
        <Group>
          <GroupButton
            on={props.locale === 'en'}
            p={1}
            onClick={() => props.dispatch(changeLocale('en'))}
          >
            en
          </GroupButton>
          <GroupButton
            on={props.locale === 'ja'}
            p={1}
            onClick={() => props.dispatch(changeLocale('ja'))}
          >
            ja
          </GroupButton>
        </Group>
      </NavLink>
      <NavLink is="span" p={1}>
        <a target="_blank" href="https://github.com/heyrict/cindy-realtime">
          <ImgSm alt="GitHub" src={githubMark} />
        </a>
      </NavLink>
      <NavLink is="span" p={1}>
        <a target="_blank" href="https://twitter.com/CindyRt_Bot">
          <ImgSm alt="GitHub" src={twitterMark} />
        </a>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuNavbar);
