/**
 *
 * Portal
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
    if (this.el.style !== undefined) {
      this.el.style.height = 0;
    }
  }
  componentDidMount() {
    document.body.appendChild(this.el);
  }
  componentWillUnmount() {
    document.body.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

Portal.propTypes = {
  children: PropTypes.any,
};

export default Portal;
