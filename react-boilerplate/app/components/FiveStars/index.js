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
import { Tooltip } from 'react-tippy';
import { FormattedMessage } from 'react-intl';
// import styled from 'styled-components';

import messages from './messages';

class FiveStars extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || 0,
      hovered: false,
    };
    this.handleMouseEnter = (v) => this.setState({ value: v, hovered: true });
    this.handleMouseLeave = (v) => this.setState({ value: v, hovered: false });
  }
  render() {
    const {
      value,
      onSet,
      starSize,
      placement,
      template,
      ...others
    } = this.props;
    let starComponent;

    if (onSet === null) {
      const UncontrolledStar = ({ v }) => (
        <Tooltip position={placement} html={template(v)} useContext>
          <Star style={{ fontSize: starSize }} checked={value >= v}>
            ★
          </Star>
        </Tooltip>
      );
      return (
        <Flex {...others}>
          <UncontrolledStar v={1} />
          <UncontrolledStar v={2} />
          <UncontrolledStar v={3} />
          <UncontrolledStar v={4} />
          <UncontrolledStar v={5} />
        </Flex>
      );
    }
    const trueVal = this.state.hovered ? this.state.value : this.props.value;
    const ControlledStar = ({ v }) => (
      <Tooltip position={placement} html={template(v)} useContext>
        <Star
          style={{ cursor: 'pointer', fontSize: starSize }}
          checked={trueVal >= v}
          onMouseEnter={() => this.handleMouseEnter(v)}
          onMouseLeave={() => this.handleMouseLeave(v)}
          onClick={() => this.props.onSet(v)}
        >
          ★
        </Star>
      </Tooltip>
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
  onSet: PropTypes.func,
  starSize: PropTypes.string.isRequired,
  template: PropTypes.func,
  placement: PropTypes.string,
};

FiveStars.defaultProps = {
  starSize: '20px',
  onSet: null,
  placement: 'top',
  template: (t) => (
    <span>
      ★ {t} : <FormattedMessage {...messages[t]} />
    </span>
  ),
};

export default FiveStars;
