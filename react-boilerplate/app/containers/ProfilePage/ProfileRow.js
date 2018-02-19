import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { FormattedMessage } from 'react-intl';
import { EditButton, ImgXs } from 'style-store';
import { text2md, to_global_id as t } from 'common';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Flex } from 'rebass';
import PreviewEdit from 'components/PreviewEdit';
import makeSelectUserNavbar from 'containers/UserNavbar/selectors';
import dialogueMessages from 'containers/Dialogue/messages';
import tick from 'images/tick.svg';
import cross from 'images/cross.svg';

import { graphql } from 'react-apollo';
import UpdateUserMutation from 'graphql/UpdateUserMutation';

import ProfRow from './ProfRow';
import messages from './messages';

class ProfileRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      content: this.props.profile,
    };
    this.toggleEdit = (mode) =>
      this.setState((p) => ({ editMode: mode || !p.editMode }));
    this.handleChange = (e) => {
      this.setState({ content: e.target.value });
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props
      .mutate({
        variables: { input: { profile: this.state.content } },
      })
      .then(() => {
        this.toggleEdit(false);
      })
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
        heading={
          <span>
            <FormattedMessage {...messages.profile} />
            {t('UserNode', this.props.currentUser.user.userId) ===
              this.props.userId &&
              !this.state.editMode && (
                <EditButton onClick={() => this.toggleEdit()}>
                  <FormattedMessage {...dialogueMessages.edit} />
                </EditButton>
              )}
          </span>
        }
        content={
          this.state.editMode ? (
            <div>
              <PreviewEdit
                content={this.state.content}
                onChange={this.handleChange}
              />
              <Flex w={1}>
                <EditButton onClick={this.handleSubmit} w={1 / 2}>
                  <ImgXs src={tick} />
                </EditButton>
                <EditButton onClick={() => this.toggleEdit(false)} w={1 / 2}>
                  <ImgXs src={cross} />
                </EditButton>
              </Flex>
            </div>
          ) : (
            <div
              style={{ overflow: 'auto' }}
              dangerouslySetInnerHTML={{
                __html: text2md(this.state.content),
              }}
            />
          )
        }
      />
    );
  }
}

ProfileRow.propTypes = {
  currentUser: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  profile: PropTypes.string.isRequired,
  mutate: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectUserNavbar(),
});

const withConnect = connect(mapStateToProps);

const withMutation = graphql(UpdateUserMutation);

export default compose(withConnect, withMutation)(ProfileRow);
