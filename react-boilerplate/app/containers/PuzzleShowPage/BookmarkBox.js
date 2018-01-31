import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { FormattedMessage } from 'react-intl';
import { Flex, Box } from 'rebass';
import Constrained from 'components/Constrained';
import Slider from 'components/Slider';
import { PuzzleFrame, ButtonOutline, ImgXs } from 'style-store';
import tag from 'images/tag.svg';

import { commitMutation } from 'react-relay';
import environment from 'Environment';
import CreateBookmarkMutation from 'graphql/CreateBookmarkMutation';

import messages from './messages';

const SubmitBtn = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px;
`;

class BookmarkBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
    this.handleChange = (e) =>
      this.setState({ value: parseInt(e.target.value, 10) });
    this.handleSaveBookmark = this.handleSaveBookmark.bind(this);
  }
  handleSaveBookmark() {
    commitMutation(environment, {
      mutation: CreateBookmarkMutation,
      variables: {
        input: {
          puzzleId: this.props.puzzleId,
          value: this.state.value,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
        bootbox.alert('Save Succeeded');
      },
    });
  }
  render() {
    if (this.props.existingBookmark.length !== 0) return null;
    return (
      <Constrained>
        <PuzzleFrame>
          <Flex wrap justify="center" align="center">
            <Box w={[1, 1 / 2]} px={10}>
              <Slider
                value={this.state.value}
                onChange={this.handleChange}
                template={(b) => (
                  <span>
                    <ImgXs
                      alt="Bookmark:"
                      src={tag}
                      style={{ marginRight: '5px' }}
                    />
                    {b}
                  </span>
                )}
              />
            </Box>
            <SubmitBtn w={[1, 1 / 2]} onClick={this.handleSaveBookmark}>
              <FormattedMessage {...messages.addBookmark} />
            </SubmitBtn>
          </Flex>
        </PuzzleFrame>
      </Constrained>
    );
  }
}

BookmarkBox.propTypes = {
  puzzleId: PropTypes.number.isRequired,
  existingBookmark: PropTypes.array.isRequired,
};

export default BookmarkBox;
