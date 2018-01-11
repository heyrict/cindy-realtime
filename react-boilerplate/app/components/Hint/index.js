/**
*
* Hint
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// eslint-disable-next-line react/prefer-stateless-function
class Hint extends React.Component {
  render() {
    return (
      <div>
        {this.props.node.content}
      </div>
    );
  }
}

Hint.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
  }),
};

export default Hint;
