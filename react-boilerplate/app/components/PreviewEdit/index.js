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
  const { content, onChange, safe } = props;
  return (
    <div>
      <MarkdownEdit
        value={content}
        onChange={onChange}
        style={{ minHeight: '200px' }}
      />
      <MarkdownPreview content={content} safe={safe} />
    </div>
  );
}

PreviewEdit.propTypes = {
  content: PropTypes.string,
  onChange: PropTypes.func,
  safe: PropTypes.bool,
};

export default PreviewEdit;
