import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import bootbox from 'bootbox';
import { FormattedMessage, intlShape } from 'react-intl';
import { nAlert } from 'containers/Notifier/actions';
import { ImgXs, EditButton, Input } from 'style-store';
import tag from 'images/tag.svg';
import tick from 'images/tick.svg';
import cross from 'images/cross.svg';
import del from 'images/delete.svg';

import { graphql } from 'react-apollo';
import dialogueMessages from 'containers/Dialogue/messages';
import UpdateBookmarkMutation from 'graphql/UpdateBookmarkMutation';
import DeleteBookmarkMutation from 'graphql/DeleteBookmarkMutation';

import messages from './messages';

class BookmarkLabel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      value: props.value,
    };
    this.toggleEditMode = () =>
      this.setState((p) => ({ editMode: !p.editMode }));
    this.handleChange = (e) =>
      this.setState({ value: parseFloat(e.target.value, 10) });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = () => {
      this.toggleEditMode();
      this.setState({ value: this.trueValue || props.value });
    };
  }
  handleSubmit() {
    const v = this.state.value;
    if (!(v >= 0 && v <= 100)) {
      this.props.alert('Value must be in [0, 100]');
      return;
    }
    this.props
      .mutateBookmarkUpdate({
        variables: {
          input: {
            bookmarkId: this.props.bookmarkId,
            value: v,
          },
        },
      })
      .then(() => {
        this.trueValue = v;
        this.setState({ editMode: false });
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }
  handleDelete() {
    const _ = this.context.intl.formatMessage;
    bootbox.confirm(_(messages.deletePrompt), (p) => {
      if (!p) return;
      this.props
        .mutateBookmarkDelete({
          variables: {
            input: {
              bookmarkId: this.props.bookmarkId,
            },
          },
        })
        .then(() => {
          this.isDeleted = true;
          this.setState({ editMode: false });
        })
        .catch((error) => {
          this.props.alert(error.message);
        });
    });
  }
  render() {
    return (
      <div>
        <ImgXs alt="Bookmark: " src={tag} style={{ marginRight: '5px' }} />
        {this.state.editMode === false || this.isDeleted ? (
          <font
            style={{
              color: '#839496',
              fontWeight: 'bold',
              fontSize: '1.1em',
            }}
          >
            {this.isDeleted ? (
              <FormattedMessage {...messages.deleted} />
            ) : (
              this.state.value
            )}
          </font>
        ) : (
          <Input
            type="number"
            value={this.state.value}
            onChange={this.handleChange}
          />
        )}
        {this.props.isCurrentUser &&
          !this.isDeleted &&
          (this.state.editMode === false ? (
            <FormattedMessage {...dialogueMessages.edit}>
              {(msg) => (
                <EditButton onClick={this.toggleEditMode}>{msg}</EditButton>
              )}
            </FormattedMessage>
          ) : (
            <div>
              <EditButton onClick={this.handleSubmit}>
                <ImgXs alt="save" src={tick} />
              </EditButton>
              <EditButton onClick={this.handleCancel}>
                <ImgXs alt="cancel" src={cross} />
              </EditButton>
              <EditButton onClick={this.handleDelete}>
                <ImgXs alt="delete" src={del} />
              </EditButton>
            </div>
          ))}
      </div>
    );
  }
}

BookmarkLabel.contextTypes = {
  intl: intlShape,
};

BookmarkLabel.propTypes = {
  value: PropTypes.number.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  bookmarkId: PropTypes.string.isRequired,
  mutateBookmarkDelete: PropTypes.func.isRequired,
  mutateBookmarkUpdate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withUpdateBookmarkMutation = graphql(UpdateBookmarkMutation, {
  name: 'mutateBookmarkUpdate',
});

const withDeleteBookmarkMutation = graphql(DeleteBookmarkMutation, {
  name: 'mutateBookmarkDelete',
});

export default compose(
  withUpdateBookmarkMutation,
  withDeleteBookmarkMutation,
  withConnect
)(BookmarkLabel);
