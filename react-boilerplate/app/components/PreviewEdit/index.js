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
  const { content, onChange, ...others } = props;
  return (
    <div>
      <MarkdownEdit
        value={props.content}
        onChange={props.onChange}
        style={{ minHeight: '200px' }}
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
  content: PropTypes.string,
  onChange: PropTypes.func,
};

export default PreviewEdit;
