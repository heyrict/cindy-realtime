/**
 *
 * TitleLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import common from 'common';

const PuzzleTitle = styled(Link)`
  display: inline-block;
  color: brown;
  font-size: 1.5em;
  margin: 0.2em;
  padding: 0.1em 0.25em;
`;

function TitleLabel(props) {
  const translatedGenre = common.genre_code_dict[props.genre];
  return (
    <PuzzleTitle to={`/puzzle/show/${props.puzzleId}`}>
      {`[${translatedGenre}] ${props.title}`}
    </PuzzleTitle>
  );
}

TitleLabel.propTypes = {
  genre: PropTypes.number.isRequired,
  puzzleId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default TitleLabel;
