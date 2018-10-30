import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { WarningBtn, PuzzleFrame } from 'style-store';

import Constrained from 'components/Constrained';

import messages from './messages';

class WarningMask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.defaultShow,
    };
    this.toggleWarnShown = () => this.setState((p) => ({ show: !p.show }));
  }
  render() {
    return this.state.show ? (
      <Constrained mt={2} mb={2}>
        <PuzzleFrame>
          <WarningBtn p={2} onClick={this.toggleWarnShown}>
            <FormattedMessage {...messages.grotesqueWarning} />
          </WarningBtn>
        </PuzzleFrame>
      </Constrained>
    ) : (
      this.props.children
    );
  }
}

WarningMask.propTypes = {
  defaultShow: PropTypes.bool.isRequired,
  children: PropTypes.any,
};

export default WarningMask;
