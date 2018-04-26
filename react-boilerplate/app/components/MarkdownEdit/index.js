/**
 *
 * MarkdownEdit
 *
 */

import React from 'react';
import { AutoResizeTextarea } from 'style-store';
// import styled from 'styled-components';

function MarkdownEdit(props) {
  return <AutoResizeTextarea {...props} />;
}

MarkdownEdit.propTypes = {};

export default MarkdownEdit;
