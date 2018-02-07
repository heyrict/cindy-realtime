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
  font-family: monaco;
  font-weight: bold;
  font-size: 0.9em;
  color: #fcf4dc;
  border: 2px solid limegreen;
  border-radius: 10px;
  padding: 0 2px;
  margin-right: 6px;
  margin-bottom: 3px;
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
