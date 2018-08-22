/**
 *
 * StarLabel
 *
 */

/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PuzzleScore = styled.button`
  background-color: darkorchid;
  border-radius: 10px;
  border: 2px solid darkorchid;
  color: #fcf4dc;
  display: inline-block;
  font-family: monaco;
  font-size: 0.9em;
  font-weight: bold;
  margin-bottom: 3px;
  margin-right: 6px;
  padding: 0 2px;
`;

function StarLabel(props) {
  const { starCount, starSum } = props;
  if (starCount > 0) {
    return <PuzzleScore>{`★${starCount}(${starSum})`}</PuzzleScore>;
  }
  return null;
}

StarLabel.propTypes = {
  starCount: PropTypes.number.isRequired,
  starSum: PropTypes.number.isRequired,
};

export default StarLabel;
