/**
 *
 * Hint
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import bootbox from 'bootbox';
import { commitMutation } from 'react-relay';
import environment from 'Environment';
import { line2md, from_global_id as f } from 'common';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Box, Flex } from 'rebass';
import Constrained from 'components/Constrained';
import {
  ImgXs,
  Textarea,
  Time,
  EditButton,
  ButtonOutline,
  PuzzleFrame as Frame,
} from 'style-store';
import tick from 'images/tick.svg';
import cross from 'images/cross.svg';

import { createStructuredSelector, createSelector } from 'reselect';
import { selectUserNavbarDomain } from 'containers/UserNavbar/selectors';
import { selectPuzzleShowPageDomain } from 'containers/PuzzleShowPage/selectors';
import hintMutation from 'graphql/UpdateHintMutation';

import dialogueMessages from 'containers/Dialogue/messages';

const StyledButton = ButtonOutline.extend`
  padding: 5px 15px;
  margin-bottom: 5px;
  border-radius: 10px;
  width: 100%;
`;

const PuzzleFrame = Frame.extend`
  margin: 5px 0;
`;

export class Hint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      content: props.node.content,
    };
    this.toggleEditMode = () =>
      this.setState((p) => ({
        editMode: !p.editMode,
      }));
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleCancel = () => {
      this.setState({ content: props.node.content });
      this.toggleEditMode();
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    if (this.state.content === '') return;
    if (this.state.content === this.props.node.content) {
      this.toggleEditMode();
      return;
    }

    const id = parseInt(f(this.props.node.id)[1], 10);
    commitMutation(environment, {
      mutation: hintMutation,
      variables: {
        input: {
          hintId: id,
          content: this.state.content,
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
    if (this.state.editMode === true) {
      return (
        <Constrained level={3}>
          <PuzzleFrame>
            <Flex align="center" mx={-1}>
              <Box w={[5 / 6, 7 / 8, 11 / 12]} mx={1}>
                <Textarea
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </Box>
              <Box w={[1 / 6, 1 / 8, 1 / 12]} mr={1}>
                <StyledButton onClick={this.handleCancel}>
                  <ImgXs src={cross} />
                </StyledButton>
                <StyledButton onClick={this.handleSubmit}>
                  <ImgXs src={tick} />
                </StyledButton>
              </Box>
            </Flex>
          </PuzzleFrame>
        </Constrained>
      );
    }
    return (
      <Constrained level={3}>
        <PuzzleFrame>
          <span
            dangerouslySetInnerHTML={{
              __html: line2md(this.props.node.content),
            }}
          />
          {this.props.owner.rowid === this.props.user.userId &&
            this.props.puzzleStatus === 0 && (
              <FormattedMessage {...dialogueMessages.edit}>
                {(msg) => (
                  <EditButton onClick={this.toggleEditMode}>{msg}</EditButton>
                )}
              </FormattedMessage>
            )}
          <Flex justify="right">
            <Time>
              {moment(this.props.node.created).format('YYYY-MM-DD HH:mm')}
            </Time>
          </Flex>
        </PuzzleFrame>
      </Constrained>
    );
  }
}

Hint.propTypes = {
  node: PropTypes.shape({
    content: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
  owner: PropTypes.object.isRequired,
  user: PropTypes.object,
  puzzleStatus: PropTypes.number.isRequired,
};

const mapStateToProps = createStructuredSelector({
  owner: createSelector(
    selectPuzzleShowPageDomain,
    (substate) => substate.get('puzzle').user
  ),
  puzzleStatus: createSelector(
    selectPuzzleShowPageDomain,
    (substate) => substate.get('puzzle').status
  ),
  user: createSelector(selectUserNavbarDomain, (substate) =>
    substate.get('user').toJS()
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hint);
