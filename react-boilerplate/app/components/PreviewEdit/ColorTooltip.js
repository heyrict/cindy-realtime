import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Input } from 'style-store';

const Table = styled.table`
  align-items: center;
  border: 0;
`;

const Td = styled.td`
  border: 0;
  margin-right: 5px;
`;

class ColorTooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultState = {
      color: 'chocolate',
      size: '14',
    };
    this.state = this.defaultState;
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.resetState = () => this.setState(this.defaultState);
  }
  handleKeyPress(e) {
    if (e.nativeEvent.keyCode === 13) {
      this.props.handleSubmit(this.state);
    }
  }
  render() {
    const btnStyle = {
      backgroundColor: this.state.color || this.defaultState.color,
      color: '#fcf4dc',
      fontSize: `${this.state.size || this.defaultState.size}px`,
    };
    return (
      <div>
        <Table style={{ alignItems: 'center' }}>
          <tbody>
            <tr>
              <Td>Color</Td>
              <Td>
                <Input
                  value={this.state.color}
                  style={{
                    border: `2px solid ${this.state.color ||
                      this.defaultState.color}`,
                  }}
                  onChange={(e) => {
                    this.setState({ color: e.target.value });
                  }}
                  onKeyUp={this.handleKeyPress}
                />
              </Td>
            </tr>
            <tr>
              <Td>Size</Td>
              <Td>
                <Input
                  value={this.state.size}
                  style={{
                    border: `2px solid ${this.state.color ||
                      this.defaultState.color}`,
                  }}
                  onChange={(e) => {
                    this.setState({ size: e.target.value });
                  }}
                  onKeyUp={this.handleKeyPress}
                />
              </Td>
            </tr>
          </tbody>
        </Table>
        <Button w={1} p={1} my={1} style={btnStyle} onClick={this.resetState}>
          Reset
        </Button>
        <Button
          w={1}
          p={1}
          my={1}
          style={btnStyle}
          onClick={() => this.props.handleSubmit(this.state)}
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
