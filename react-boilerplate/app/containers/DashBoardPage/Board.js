import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { RoundedPanel } from 'style-store';

const BoardHeader = styled.div`
  background-color: #a02d92;
  color: blanchedalmond;
  font-size: 1.2em;
  padding: 5px;
  width: 100%;
`;

function Board(props) {
  return (
    <RoundedPanel style={{ minHeight: '150px', margin: '8px 5px' }}>
      <BoardHeader>{props.title}</BoardHeader>
      {props.content}
    </RoundedPanel>
  );
}

Board.propTypes = {
  title: PropTypes.any,
  content: PropTypes.any,
};

export default Board;
