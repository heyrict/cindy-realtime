/**
 *
 * LoadingDots
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex } from 'rebass';

export const Dot = styled.span`
  padding: ${(props) => props.size || 5}px;
  margin: ${(props) => props.size || 5}px;
  border-radius: 9999px;
  background-color: ${(props) => (props.active ? '#666' : '#aaa')};
`;

class LoadingDots extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
    };
  }

  componentDidMount() {
    this.timer = window.setInterval(
      () =>
        this.setState((prevState) => ({ active: (prevState.active + 1) % 3 })),
      1000
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  render() {
    const { size, ...others } = this.props;
    return (
      <Flex justify="center" {...others}>
        <Dot active={this.state.active === 0} size={size} />
        <Dot active={this.state.active === 1} size={size} />
        <Dot active={this.state.active === 2} size={size} />
      </Flex>
    );
  }
}

LoadingDots.propTypes = {
  size: PropTypes.number,
};

export default LoadingDots;
