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
  const { content, onChange, safe, style, ...others } = props;
  return (
    <div>
      <MarkdownEdit
        value={content}
        onChange={onChange}
        style={{
          ...style,
          minHeight: '100px',
          borderRadius: '5px 5px 0 0',
        }}
        minRows={3}
        maxRows={7}
        {...others}
      />
      <MarkdownPreview content={content} safe={safe} />
    </div>
  );
}

PreviewEdit.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  content: PropTypes.string,
  onChange: PropTypes.func,
  safe: PropTypes.bool,
};

PreviewEdit.defaultProps = {
  style: {},
  safe: true,
};

export default PreviewEdit;
