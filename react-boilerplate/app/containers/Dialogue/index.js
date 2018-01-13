/**
 *
 * Dialogue
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

// import messages from './messages';

import Dialog from './Dialog';

// eslint-disable-next-line react/prefer-stateless-function
class Dialogue extends React.Component {
  render() {
    return <Dialog node={this.props.node} index={this.props.index} />;
  }
}

Dialogue.propTypes = {
  node: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect)(Dialogue);
