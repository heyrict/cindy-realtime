/**
 *
 * Dialogue
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// eslint-disable-next-line react/prefer-stateless-function
class Dialogue extends React.Component {
  render() {
    return <div>{this.props.node.question}</div>;
  }
}

Dialogue.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    good: PropTypes.bool.isRequired,
    true: PropTypes.bool.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string,
    created: PropTypes.string.isRequired,
    answeredTime: PropTypes.string,
  }),
};

export default Dialogue;
