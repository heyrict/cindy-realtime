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
  const { content, onChange, style, ...others } = props;
  return (
    <div>
      <MarkdownEdit
        value={props.content}
        onChange={props.onChange}
        style={{ ...style, minHeight: '100px', borderRadius: '5px 5px 0 0' }}
        minRows={3}
        maxRows={7}
        {...others}
      />
      <MarkdownPreview content={props.content} />
    </div>
  );
}

PreviewEdit.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  content: PropTypes.string,
  onChange: PropTypes.func,
};

PreviewEdit.defaultProps = {
  style: {},
};

export default PreviewEdit;
