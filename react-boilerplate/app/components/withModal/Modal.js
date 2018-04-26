import React from 'react';
import posed from 'react-pose';
import PropTypes from 'prop-types';

const shaderProps = {
  show: {
    display: 'block',
    opacity: 1,
  },
  hide: {
    display: 'none',
    opacity: 0,
  },
};

const containerProps = {
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
};

const Shader = posed.div(shaderProps);
const Container = posed.div(containerProps);

const Modal = (props) => (
  <div style={{ display: 'inline-block' }}>
    <Shader
      className="modal-shade"
      pose={props.show ? 'show' : 'hide'}
      style={{ display: props.show ? 'block' : 'none' }}
    />
    <div
      className="modal-container"
      style={{ display: props.show ? 'flex' : 'none' }}
    >
      <Container className="modal" pose={props.show ? 'show' : 'hide'}>
        {props.children}
      </Container>
    </div>
  </div>
);

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default Modal;
