import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'style-store';

class ColorTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      color: '#5856b9',
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  handleKeyPress(e) {
    const color = this.state.color;
    if (e.nativeEvent.keyCode === 13) {
      this.props.handleSubmit(color);
    }
  }
  render() {
    return (
      <div>
        <Input
          placeholder="Enter color here"
          style={{
            border: `2px solid ${this.state.color}`,
          }}
          onChange={(e) => {
            this.setState({ color: e.target.value });
          }}
        />
        <Button
          w={1}
          p={1}
          my={1}
          style={{
            backgroundColor: this.state.color,
            color: '#fcf4dc',
          }}
          onClick={() => this.props.handleSubmit(this.state.color)}
          onKeyUp={this.handleKeyPress}
        >
          Confirm
        </Button>
      </div>
    );
  }
}

ColorTooltip.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default ColorTooltip;
