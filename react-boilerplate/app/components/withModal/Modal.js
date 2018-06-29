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

class Modal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      display: props.show,
    };
    this.handlePoseComplete = () => {
      if (this.state.display && !this.props.show) {
        this.setState({ display: false });
      }
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.display && nextProps.show) {
      this.setState({ display: nextProps.show });
    }
  }
  render() {
    return (
      <div
        className="modal-container"
        style={{
          display: this.state.display ? 'flex' : 'none',
          overflowY: 'auto',
          padding: '80px 0',
        }}
      >
        <Shader
          className="modal-shade"
          pose={this.props.show ? 'show' : 'hide'}
          style={{ display: this.state.display ? 'flex' : 'none' }}
          onPoseComplete={this.handlePoseComplete}
          onClick={this.props.onHide}
        />
        <Container
          className="modal"
          pose={this.props.show ? 'show' : 'hide'}
          style={{
            overflowY: 'auto',
          }}
        >
          {this.props.children}
        </Container>
      </div>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  children: PropTypes.any,
  onHide: PropTypes.func.isRequired,
};

export default Modal;
