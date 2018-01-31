import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import { FormattedMessage } from 'react-intl';
import { ImgXs, EditButton, Input } from 'style-store';
import tag from 'images/tag.svg';
import tick from 'images/tick.svg';

import dialogueMessages from 'containers/Dialogue/messages';
import UpdateBookmarkMutation from 'graphql/UpdateBookmarkMutation';

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
  }
  handleSubmit() {
    const v = this.state.value;
    if (!(v >= 0 && v <= 100)) {
      bootbox.alert('Value must be in [0, 100]');
      return;
    }
    commitMutation(environment, {
      mutation: UpdateBookmarkMutation,
      variables: {
        input: {
          bookmarkId: this.props.bookmarkId,
          value: v,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
      },
    });
    this.setState({ editMode: false });
  }
  render() {
    return (
      <div>
        <ImgXs alt="Bookmark: " src={tag} style={{ marginRight: '5px' }} />
        {this.state.editMode === false ? (
          <font
            style={{
              color: '#839496',
              fontWeight: 'bold',
              fontSize: '1.1em',
            }}
          >
            {this.state.value}
          </font>
        ) : (
          <Input
            type="number"
            value={this.state.value}
            onChange={this.handleChange}
          />
        )}
        {this.props.isCurrentUser &&
          (this.state.editMode === false ? (
            <FormattedMessage {...dialogueMessages.edit}>
              {(msg) => (
                <EditButton onClick={this.toggleEditMode}>{msg}</EditButton>
              )}
            </FormattedMessage>
          ) : (
            <EditButton onClick={this.handleSubmit}>
              <ImgXs alt="save" src={tick} />
            </EditButton>
          ))}
      </div>
    );
  }
}

BookmarkLabel.propTypes = {
  value: PropTypes.number.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  bookmarkId: PropTypes.string.isRequired,
};

export default BookmarkLabel;
