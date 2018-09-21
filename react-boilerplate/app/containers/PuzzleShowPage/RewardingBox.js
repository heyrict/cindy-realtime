import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { nAlert } from 'containers/Notifier/actions';
import { Flex } from 'rebass';
import Constrained from 'components/Constrained';
import FiveStars from 'components/FiveStars';
import { PuzzleFrame, ButtonOutline, Input, Switch } from 'style-store';

import { graphql } from 'react-apollo';
import UpdateStarMutation from 'graphql/UpdateStarMutation';
import UpdateCommentMutation from 'graphql/UpdateCommentMutation';

import messages from './messages';

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
        this.props.alert(error.message);
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
      this.props.alert(<FormattedMessage {...messages.zeroStarAlert} />);
      return;
    }
    this.setState({
      commitStar: {
        puzzleId: this.props.puzzleId,
        value: this.state.stars,
      },
    });
    this.props.alert(<FormattedMessage {...messages.saveSucceededAlert} />);
  }
  handleSaveComment() {
    if (this.state.comment === '') {
      this.props.alert(<FormattedMessage {...messages.commentNoBlankAlert} />);
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
        this.props.alert(<FormattedMessage {...messages.saveSucceededAlert} />);
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }
  render() {
    return (
      <Constrained>
        <PuzzleFrame>
          <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
            <FiveStars
              justify="center"
              align="center"
              value={this.state.stars}
              onSet={this.handleStarSet}
              w={1 / 2}
            />
            <ButtonOutline w={1 / 2} p={1} onClick={this.handleSaveStar}>
              <FormattedMessage {...messages.addStar} />
            </ButtonOutline>
            {this.state.commitStar && (
              <button onClick={this.cancelStar}>
                <FormattedMessage {...messages.cancelStar} />
              </button>
            )}
          </Flex>
        </PuzzleFrame>
        <PuzzleFrame>
          <Flex flexWrap="wrap" mt={10}>
            <Input
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
            <ButtonOutline w={1} p={1} mt={1} onClick={this.handleSaveComment}>
              <FormattedMessage {...messages.addComment} />
            </ButtonOutline>
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
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withStarUpdateMutation = graphql(UpdateStarMutation, {
  name: 'mutateStarUpdate',
});

const withCommentUpdateMutation = graphql(UpdateCommentMutation, {
  name: 'mutateCommentUpdate',
});

export default compose(
  withStarUpdateMutation,
  withCommentUpdateMutation,
  withConnect,
)(RewardingBox);
