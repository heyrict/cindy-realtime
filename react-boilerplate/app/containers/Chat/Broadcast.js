import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';

import { Flex } from 'rebass';
import { ButtonOutline, Textarea, Input } from 'style-store';
import FieldGroup from 'components/FieldGroup';

import { sendBroadcast } from './actions';
import messages from './messages';

class Broadcast extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      autoDismiss: 10,
    };

    this.handleChange = (e) => {
      switch (e.target.id) {
        case 'broadcast_content':
          this.setState({ message: e.target.value });
          break;
        case 'broadcast_autoDismiss':
          this.setState({ autoDismiss: e.target.value });
          break;
        default:
      }
    };
    this.handleSend = () => {
      this.props.sendBroadcast(this.state);
      this.setState({
        message: '',
      });
    };
  }
  render() {
    return (
      <Flex
        flexWrap="wrap"
        style={{ maxHeight: this.props.height, overflowY: 'auto' }}
      >
        <FieldGroup
          label={<FormattedMessage {...messages.content} />}
          CtlElement={
            <Textarea
              id="broadcast_content"
              value={this.state.message}
              onChange={this.handleChange}
            />
          }
        />
        <FieldGroup
          label={<FormattedMessage {...messages.autoDismiss} />}
          CtlElement={
            <Input
              type="number"
              id="broadcast_autoDismiss"
              value={this.state.autoDismiss}
              onChange={this.handleChange}
            />
          }
        />
        <ButtonOutline p={1} w={1} onClick={this.handleSend}>
          <FormattedMessage {...messages.send} />
        </ButtonOutline>
      </Flex>
    );
  }
}

Broadcast.propTypes = {
  height: PropTypes.number.isRequired,
  sendBroadcast: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    sendBroadcast: (payload) => dispatch(sendBroadcast(payload)),
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps
);

export default compose(withConnect)(Broadcast);
