import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Switch } from 'style-store';
import { Flex } from 'rebass';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import bootbox from 'bootbox';
import UpdateUserMutation from 'graphql/UpdateUserMutation';

import ProfRow from './ProfRow';
import messages from './messages';

class AwardSwitch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hideBookmark: props.hideBookmark,
    };
    this.switch = () =>
      this.setState((p) => ({ hideBookmark: !p.hideBookmark }));
  }

  componentWillUnmount() {
    if (this.state.hideBookmark === this.props.hideBookmark) {
      return;
    }
    commitMutation(environment, {
      mutation: UpdateUserMutation,
      variables: { input: { hideBookmark: this.state.hideBookmark } },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert({
            title: 'Error',
            message: errors.map((error) => error.message).join(','),
          });
        }
      },
      onError: (err) => console.error(err),
    });
  }

  render() {
    return (
      <ProfRow
        heading={<FormattedMessage {...messages.hideBookmark} />}
        content={
          <Flex wrap>
            <Switch
              checked={this.state.hideBookmark}
              onClick={() => this.switch()}
            />
          </Flex>
        }
      />
    );
  }
}

AwardSwitch.propTypes = {
  hideBookmark: PropTypes.bool.isRequired,
};

export default AwardSwitch;
