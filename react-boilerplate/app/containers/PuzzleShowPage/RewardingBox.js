import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { FormattedMessage } from 'react-intl';
import { Flex } from 'rebass';
import Constrained from 'components/Constrained';
import FiveStars from 'components/FiveStars';
import { PuzzleFrame, ButtonOutline, Input, Switch } from 'style-store';

import { commitMutation } from 'react-relay';
import environment from 'Environment';
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
      stars: this.props.existingStar.length === 0 ? 0 : null,
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
    this.handleSaveStar = this.handleSaveStar.bind(this);
    this.handleSaveComment = this.handleSaveComment.bind(this);
  }
  handleSaveStar() {
    commitMutation(environment, {
      mutation: UpdateStarMutation,
      variables: {
        input: {
          puzzleId: this.props.puzzleId,
          value: this.state.stars,
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
  handleSaveComment() {
    commitMutation(environment, {
      mutation: UpdateCommentMutation,
      variables: {
        input: {
          puzzleId: this.props.puzzleId,
          content: this.state.comment,
          spoiler: this.state.spoiler,
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
    return (
      <Constrained>
        {this.state.stars !== null && (
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
            </Flex>
          </PuzzleFrame>
        )}
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
};

export default RewardingBox;
