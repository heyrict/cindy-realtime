/**
*
* PreviewEdit
*
*/

import React from 'react';
import MarkdownEdit from 'components/MarkdownEdit';
import MarkdownPreview from 'components/MarkdownPreview';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function PreviewEdit(props) {
  // eslint-disable-line react/prefer-stateless-function
  return (
    <div>
      <MarkdownEdit
        value={props.content}
        onChange={props.onChange}
        style={{ minHeight: '200px' }}
      />
      <MarkdownPreview content={props.content} />
    </div>
  );
}

PreviewEdit.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
};

export default PreviewEdit;
