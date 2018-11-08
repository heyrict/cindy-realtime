/**
 *
 * PuzzleNavbar
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Flex } from 'rebass';
import { Button } from 'style-store';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withLocale } from 'common';

import dashboardMessages from 'containers/DashBoardPage/messages';
import puzzlepageMessages from 'containers/PuzzlePage/messages';

const ToolButton = styled(Button)`
  padding: 5px;
  background-color: darkgoldenrod;
  &:hover {
    background-color: goldenrod;
  }
`;

const ButtonLink = styled(Link)`
  color: #fcf4dc;
  width: 100%;
`;

function PuzzleNavbar() {
  return (
    <Flex alignItems="center" justifyContent="center" w={1} mb={3}>
      <ButtonLink to={withLocale('/puzzle')}>
        <ToolButton w={1}>
          <FormattedMessage {...puzzlepageMessages.header} />
        </ToolButton>
      </ButtonLink>
      <ButtonLink to={withLocale('/puzzle/add')}>
        <ToolButton w={1}>
          <FormattedMessage {...puzzlepageMessages.newPuzzle} />
        </ToolButton>
      </ButtonLink>
      <ButtonLink to={withLocale('/dashboard')}>
        <ToolButton w={1}>
          <FormattedMessage {...dashboardMessages.heading} />
        </ToolButton>
      </ButtonLink>
    </Flex>
  );
}

PuzzleNavbar.propTypes = {};

export default PuzzleNavbar;
