/**
 *
 * TitleLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const PuzzleTitle = styled(Link)`
  display: inline-block;
  color: brown;
  font-size: 1.5em;
  margin: 0.2em;
  padding: 0.1em 0.25em;
`;

const TranslatedGenre = ({ genre }) => {
  switch (genre) {
    case 0:
      return <FormattedMessage {...messages.classic} />;
    case 1:
      return <FormattedMessage {...messages.twentyQuestions} />;
    case 2:
      return <FormattedMessage {...messages.littleAlbat} />;
    case 3:
      return <FormattedMessage {...messages.others} />;
    default:
      return null;
  }
};

TranslatedGenre.propTypes = {
  genre: PropTypes.number.isRequired,
};

function TitleLabel(props) {
  return (
    <PuzzleTitle to={`/puzzle/show/${props.puzzleId}`}>
      [{<TranslatedGenre genre={props.genre} />}
      {props.yami ? ' x ' : null}
      {props.yami ? <FormattedMessage {...messages.yami} /> : null}]
      {props.title}
    </PuzzleTitle>
  );
}

TitleLabel.propTypes = {
  genre: PropTypes.number.isRequired,
  yami: PropTypes.bool.isRequired,
  puzzleId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default TitleLabel;
