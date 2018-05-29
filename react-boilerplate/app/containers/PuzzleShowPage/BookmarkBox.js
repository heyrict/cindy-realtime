import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { nAlert } from 'containers/Notifier/actions';

import { Flex, Box } from 'rebass';
import Constrained from 'components/Constrained';
import Slider from 'components/Slider';
import { PuzzleFrame, ButtonOutline, ImgXs } from 'style-store';
import tag from 'images/tag.svg';

import { graphql } from 'react-apollo';
import CreateBookmarkMutation from 'graphql/CreateBookmarkMutation';

import messages from './messages';

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
    this.props
      .mutate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            value: this.state.value,
          },
        },
      })
      .then(() => {
        this.props.alert('Save Succeeded');
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }
  render() {
    if (this.props.existingBookmark.length !== 0) return null;
    return (
      <Constrained>
        <PuzzleFrame>
          <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
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
            <ButtonOutline
              w={[1, 1 / 2]}
              p={1}
              onClick={this.handleSaveBookmark}
            >
              <FormattedMessage {...messages.addBookmark} />
            </ButtonOutline>
          </Flex>
        </PuzzleFrame>
      </Constrained>
    );
  }
}

BookmarkBox.propTypes = {
  puzzleId: PropTypes.number.isRequired,
  existingBookmark: PropTypes.array.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(null, mapDispatchToProps);

const withMutation = graphql(CreateBookmarkMutation);

export default compose(withMutation, withConnect)(BookmarkBox);
