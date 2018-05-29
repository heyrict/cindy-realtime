/**
 *
 * BookmarkLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ImgXs } from 'style-store';
import bookmark from 'images/bookmark.svg';

const PuzzleBookmarks = styled.span`
  background-color: limegreen;
  border-radius: 10px;
  border: 2px solid limegreen;
  color: #fcf4dc;
  display: inline-block;
  font-family: monaco;
  font-size: 0.9em;
  font-weight: bold;
  margin-bottom: 3px;
  margin-right: 6px;
  padding: 0 2px;
`;

function BookmarkLabel(props) {
  const { bookmarkCount } = props;
  if (bookmarkCount > 0) {
    return (
      <PuzzleBookmarks>
        <ImgXs src={bookmark} alt="bookmark" />
        <span style={{ paddingLeft: '2px' }}>{bookmarkCount}</span>
      </PuzzleBookmarks>
    );
  }
  return null;
}

BookmarkLabel.propTypes = {
  bookmarkCount: PropTypes.number.isRequired,
};

export default BookmarkLabel;
