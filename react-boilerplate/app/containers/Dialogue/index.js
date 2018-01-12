/**
 *
 * Dialogue
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import makeSelectDialogue from './selectors';
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
};

const mapStateToProps = createStructuredSelector({
  dialogue: makeSelectDialogue(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Dialogue);
