/**
 *
 * ScheduleAddItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'style-store';

import ScheduleAddModal from './index';

export class ScheduleAddItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.toggleShow = (show) => this.setState({ show });
  }
  render() {
    const { children, ...others } = this.props;
    return (
      <span style={{ color: '#333', fontSize: '14px' }}>
        <Button
          onClick={() => this.toggleShow(true)}
          role="button"
          tabIndex="0"
          {...others}
        >
          {this.props.children}
        </Button>
        <ScheduleAddModal
          show={this.state.show}
          onHide={() => this.toggleShow(false)}
        />
      </span>
    );
  }
}

ScheduleAddItem.propTypes = {
  children: PropTypes.node,
};

export default ScheduleAddItem;
