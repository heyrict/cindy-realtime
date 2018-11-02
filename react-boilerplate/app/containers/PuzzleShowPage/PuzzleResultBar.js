import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import { Button, ImgSm as Img } from 'style-store';

import RewardingModal from 'components/RewardingModal/Loadable';

import comment from 'images/comment.svg';
import star from 'images/star-white.svg';
import messages from './messages';

class PuzzleResultBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentModalShown: false,
    };

    this.toggleCommentModal = (v) =>
      this.setState((p) => ({
        commentModalShown: v === undefined ? !p.commentModalShown : v,
      }));
  }

  render() {
    return (
      <Flex justifyContent="center" alignItems="center" my={1}>
        <FormattedMessage {...messages.starCount}>
          {(msg) => (
            <Button w={1} bg="purple" mx={1}>
              <Img src={star} alt="star" />
              <span>
                {msg}: {this.props.starCount}({this.props.starSum})
              </span>
            </Button>
          )}
        </FormattedMessage>
        <FormattedMessage {...messages.commentCount}>
          {(msg) => (
            <Button
              w={1}
              mx={1}
              onClick={() =>
                this.props.commentCount && this.toggleCommentModal()
              }
            >
              <Img src={comment} alt="comment" />
              <span>
                {msg}: {this.props.commentCount}
              </span>
            </Button>
          )}
        </FormattedMessage>
        {this.props.commentCount > 0 && (
          <RewardingModal
            id={this.props.puzzleId}
            show={this.state.commentModalShown}
            onHide={() => this.toggleCommentModal(false)}
            showContent={false}
          />
        )}
      </Flex>
    );
  }
}

PuzzleResultBar.propTypes = {
  puzzleId: PropTypes.string.isRequired,
  starCount: PropTypes.number,
  starSum: PropTypes.number,
  commentCount: PropTypes.number,
};

PuzzleResultBar.defaultProps = {
  starCount: 0,
  commentCount: 0,
};

export default PuzzleResultBar;
