/**
 *
 * FiveStars
 *
 * Props
 * -----
 *  value: number in [0, 5]
 *  onSet: function(value: number in [0, 5]): any
 *  ...others: props passed to rebass Flex component
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'rebass';
import { Star } from 'style-store';
// import styled from 'styled-components';

class FiveStars extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      hovered: false,
    };
    this.handleMouseEnter = (v) => this.setState({ value: v, hovered: true });
    this.handleMouseLeave = (v) => this.setState({ value: v, hovered: false });
  }
  render() {
    const { value, onSet, ...others } = this.props;
    const trueVal = this.state.hovered ? this.state.value : this.props.value;
    const ControlledStar = ({ v }) => (
      <Star
        style={{ cursor: 'pointer' }}
        checked={trueVal >= v}
        onMouseEnter={() => this.handleMouseEnter(v)}
        onMouseLeave={() => this.handleMouseLeave(v)}
        onClick={() => this.props.onSet(v)}
      />
    );
    return (
      <Flex {...others}>
        <ControlledStar v={1} />
        <ControlledStar v={2} />
        <ControlledStar v={3} />
        <ControlledStar v={4} />
        <ControlledStar v={5} />
      </Flex>
    );
  }
}

FiveStars.propTypes = {
  value: PropTypes.number.isRequired,
  onSet: PropTypes.func.isRequired,
};

export default FiveStars;
