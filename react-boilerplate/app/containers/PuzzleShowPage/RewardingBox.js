import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import Constrained from 'components/Constrained';
import FiveStars from 'components/FiveStars';
import { PuzzleFrame, ButtonOutline, Input, Switch } from 'style-store';

import { graphql } from 'react-apollo';
import UpdateStarMutation from 'graphql/UpdateStarMutation';
import UpdateCommentMutation from 'graphql/UpdateCommentMutation';

import messages from './messages';

const SubmitBtn = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px;
`;

const CommentInput = Input.extend`
  border-radius: 10px;
`;

class RewardingBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stars:
        this.props.existingStar.length === 0
          ? 0
          : this.props.existingStar[0].node.value,
      commitStar: false,
      comment:
        this.props.existingComment.length === 0
          ? ''
          : this.props.existingComment[0].node.content,
      spoiler:
        this.props.existingComment.length === 0
          ? false
          : this.props.existingComment[0].node.spoiler,
    };
    this.handleStarSet = (value) => this.setState({ stars: value });
    this.handleCommentChange = (e) =>
      this.setState({ comment: e.target.value });
    this.handleSpoilerClick = () =>
      this.setState((p) => ({ spoiler: !p.spoiler }));
    this.cancelStar = this.cancelStar.bind(this);
    this.handleSaveStar = this.handleSaveStar.bind(this);
    this.handleSaveComment = this.handleSaveComment.bind(this);
  }
  componentWillUnmount() {
    if (!this.state.commitStar) return;
    this.props
      .mutateStarUpdate({
        variables: {
          input: this.state.commitStar,
        },
      })
      .then(() => {})
      .catch((error) => {
        bootbox.alert({
          title: 'Error',
          message: error.message,
        });
      });
  }
  cancelStar() {
    this.setState({
      stars: 0,
      commitStar: false,
    });
  }
  handleSaveStar() {
    if (this.state.stars === 0) {
      bootbox.alert('Please Choose at least one star!');
      return;
    }
    this.setState({
      commitStar: {
        puzzleId: this.props.puzzleId,
        value: this.state.stars,
      },
    });
    bootbox.alert('Save Succeeded');
  }
  handleSaveComment() {
    if (this.state.comment === '') {
      bootbox.alert('Comment cannot be blank!');
      return;
    }
    this.props
      .mutateCommentUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            content: this.state.comment,
            spoiler: this.state.spoiler,
          },
        },
      })
      .then(() => {
        bootbox.alert('Save Succeeded');
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
      <Constrained>
        <PuzzleFrame>
          <Flex wrap justify="center" align="center">
            <FiveStars
              justify="center"
              align="center"
              value={this.state.stars}
              onSet={this.handleStarSet}
              w={1 / 2}
            />
            <SubmitBtn w={1 / 2} onClick={this.handleSaveStar}>
              <FormattedMessage {...messages.addStar} />
            </SubmitBtn>
            {this.state.commitStar && (
              <button onClick={this.cancelStar}>
                <FormattedMessage {...messages.cancelStar} />
              </button>
            )}
          </Flex>
        </PuzzleFrame>
        <PuzzleFrame>
          <Flex wrap mt={10}>
            <CommentInput
              value={this.state.comment}
              onChange={this.handleCommentChange}
            />
            <div>
              <FormattedMessage {...messages.spoiler} />
              <Switch
                checked={this.state.spoiler}
                onClick={this.handleSpoilerClick}
              />
            </div>
            <SubmitBtn w={1} mt={5} onClick={this.handleSaveComment}>
              <FormattedMessage {...messages.addComment} />
            </SubmitBtn>
          </Flex>
        </PuzzleFrame>
      </Constrained>
    );
  }
}

RewardingBox.propTypes = {
  puzzleId: PropTypes.number.isRequired,
  existingStar: PropTypes.array.isRequired,
  existingComment: PropTypes.array.isRequired,
  mutateStarUpdate: PropTypes.func.isRequired,
  mutateCommentUpdate: PropTypes.func.isRequired,
};

const withStarUpdateMutation = graphql(UpdateStarMutation, {
  name: 'mutateStarUpdate',
});

const withCommentUpdateMutation = graphql(UpdateCommentMutation, {
  name: 'mutateCommentUpdate',
});

export default compose(withStarUpdateMutation, withCommentUpdateMutation)(
  RewardingBox
);
