/**
*
* TitleLabel
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router";
// import styled from 'styled-components';
import common from "common";


function TitleLabel() {
    const translatedGenre = common.genre_code_dict[props.genre];
    return (
      <span className="title_label">
        <Link to={"/puzzle/show/" + props.puzzleId}>
          {`[${translatedGenre}] ${props.title}`}
        </Link>
      </span>
    );
}

TitleLabel.propTypes = {
  genre: PropTypes.number.isRequired,
  puzzleId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

export default TitleLabel;
