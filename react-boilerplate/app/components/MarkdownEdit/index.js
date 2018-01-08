/**
*
* MarkdownEdit
*
*/

import React from 'react';
import { FormControl } from 'react-bootstrap';
// import styled from 'styled-components';

function MarkdownEdit(props) {
  return <FormControl {...props} componentClass="textarea" />;
}

MarkdownEdit.propTypes = {};

export default MarkdownEdit;
