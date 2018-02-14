import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Switch } from 'style-store';
import { Flex } from 'rebass';
import bootbox from 'bootbox';
import { graphql } from 'react-apollo';
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
    this.props
      .mutate({
        variables: { input: { hideBookmark: this.state.hideBookmark } },
      })
      .then(() => {})
      .catch((error) => {
        bootbox.alert({
          title: 'Error',
          message: error.message,
        });
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
  mutate: PropTypes.func.isRequired,
};

const withMutate = graphql(UpdateUserMutation);

export default withMutate(AwardSwitch);
