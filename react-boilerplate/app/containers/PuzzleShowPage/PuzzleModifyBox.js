import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import bootbox from 'bootbox';
import { commitMutation, graphql } from 'react-relay';
import environment from 'Environment';
import { FormattedMessage } from 'react-intl';
import { Tabs, TabItem, Flex, Box } from 'rebass';
import Constrained from 'components/Constrained';
import { text2md } from 'common';
import dialogueMessages from 'containers/Dialogue/messages';
import PreviewEdit from 'components/PreviewEdit';
import { StyledTextarea } from 'containers/Hint';

import tick from 'images/tick.svg';
import cross from 'images/cross.svg';
import { StyledEditButton, StyledSwitch } from 'containers/Dialogue/Answer';
import { ImgXs } from 'style-store';
import { PuzzleFrame } from './Frame';
import messages from './messages';
//
// {{{ const answerMutation
const puzzleUpdateMutation = graphql`
  mutation PuzzleModifyBoxMutation($input: UpdatePuzzleInput!) {
    updatePuzzle(input: $input) {
      clientMutationId
    }
  }
`;
// }}}

// {{{ const hintMutation
const hintMutation = graphql`
  mutation PuzzleModifyBoxHintMutation($input: CreateHintInput!) {
    createHint(input: $input) {
      clientMutationId
    }
  }
`;
// }}}

const StyledTabItem = styled(TabItem)`
  color: #006388;
  cursor: pointer;
  &:hover {
    color: #6c71c4;
  }
`;

const StyledTabs = styled(Tabs)`
  border-color: #006388;
  margin-bottom: 5px;
`;

class PuzzleModifyBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.puzzle.status === 0 ? 0 : 1,
      solution: props.puzzle.solution,
      memo: props.puzzle.memo,
      solutionEditMode: false,
      memoEditMode: props.puzzle.memo === '',
      solve: props.puzzle.status !== 0,
      yami: props.puzzle.yami,
      hidden: props.puzzle.hidden,
      hint: '',
    };
    this.changeTab = (t) => {
      this.setState({ activeTab: t });
    };
    this.toggleSolutionEditMode = () => {
      this.setState((p) => ({ solutionEditMode: !p.solutionEditMode }));
    };
    this.toggleMemoEditMode = () => {
      this.setState((p) => ({ memoEditMode: !p.memoEditMode }));
    };
    this.handleSolutionChange = (e) => {
      this.setState({ solution: e.target.value });
    };
    this.handleMemoChange = (e) => {
      this.setState({ memo: e.target.value });
    };
    this.handleHintChange = (e) => {
      this.setState({ hint: e.target.value });
    };
    this.handleSolveChange = () => {
      this.setState((p) => ({ solve: !p.solve }));
    };
    this.handleYamiChange = () => {
      this.setState((p) => ({ yami: !p.yami }));
    };
    this.handleHiddenChange = () => {
      this.setState((p) => ({ hidden: !p.hidden }));
    };
    this.handleSaveSolution = this.handleSaveSolution.bind(this);
    this.handleSaveMemo = this.handleSaveMemo.bind(this);
    this.handleSaveControl = this.handleSaveControl.bind(this);
    this.handleCreateHint = this.handleCreateHint.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.puzzle.memo !== nextProps.puzzle.memo ||
      this.props.puzzle.solution !== nextProps.puzzle.solution
    ) {
      this.setState({
        memo: nextProps.puzzle.memo,
        solution: nextProps.puzzle.solution,
        solutionEditMode: false,
        memoEditMode: false,
      });
    }
  }

  handleSaveSolution() {
    this.toggleSolutionEditMode();
    if (this.state.solution === this.props.puzzle.solution) return;
    commitMutation(environment, {
      mutation: puzzleUpdateMutation,
      variables: {
        input: {
          puzzleId: this.props.puzzleId,
          solution: this.state.solution,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
      },
    });
  }

  handleSaveMemo() {
    this.toggleMemoEditMode();
    if (this.state.memo === this.props.puzzle.memo) return;
    commitMutation(environment, {
      mutation: puzzleUpdateMutation,
      variables: {
        input: {
          puzzleId: this.props.puzzleId,
          memo: this.state.memo,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
      },
    });
  }

  handleSaveControl() {
    commitMutation(environment, {
      mutation: puzzleUpdateMutation,
      variables: {
        input: {
          puzzleId: this.props.puzzleId,
          solve: this.state.solve,
          yami: this.state.yami,
          hidden: this.state.hidden,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
        }
      },
    });
  }

  handleCreateHint() {
    if (this.state.hint === '') return;
    commitMutation(environment, {
      mutation: hintMutation,
      variables: {
        input: {
          puzzleId: this.props.puzzleId,
          content: this.state.hint,
        },
      },
      onCompleted: (response, errors) => {
        if (errors) {
          bootbox.alert(errors.map((e) => e.message).join(','));
          return;
        }
        this.setState({ hint: '' });
      },
    });
  }

  render() {
    return (
      <Constrained level={3}>
        <PuzzleFrame>
          <StyledTabs>
            <StyledTabItem
              active={this.state.activeTab === 0}
              onClick={() => this.changeTab(0)}
              hidden={this.props.puzzle.status !== 0}
            >
              <FormattedMessage {...messages.solution} />
            </StyledTabItem>
            <StyledTabItem
              active={this.state.activeTab === 1}
              onClick={() => this.changeTab(1)}
            >
              <FormattedMessage {...messages.memo} />
            </StyledTabItem>
            <StyledTabItem
              active={this.state.activeTab === 2}
              onClick={() => this.changeTab(2)}
              hidden={this.props.puzzle.status !== 0}
            >
              <FormattedMessage {...messages.hint} />
            </StyledTabItem>
            <StyledTabItem
              active={this.state.activeTab === 3}
              onClick={() => this.changeTab(3)}
            >
              <FormattedMessage {...messages.controlPanel} />
            </StyledTabItem>
          </StyledTabs>
          <div hidden={this.state.activeTab !== 0}>
            <div hidden={this.state.solutionEditMode}>
              <span
                dangerouslySetInnerHTML={{
                  __html: text2md(this.props.puzzle.solution),
                }}
              />
              <StyledEditButton onClick={this.toggleSolutionEditMode}>
                <FormattedMessage {...dialogueMessages.edit} />
              </StyledEditButton>
            </div>
            <div hidden={!this.state.solutionEditMode}>
              <PreviewEdit
                content={this.state.solution}
                onChange={this.handleSolutionChange}
              />
              <Flex>
                <StyledEditButton
                  onClick={this.handleSaveSolution}
                  style={{ width: '100%' }}
                >
                  <ImgXs src={tick} />
                </StyledEditButton>
                <StyledEditButton
                  onClick={this.toggleSolutionEditMode}
                  style={{ width: '100%' }}
                >
                  <ImgXs src={cross} />
                </StyledEditButton>
              </Flex>
            </div>
          </div>
          <div hidden={this.state.activeTab !== 1}>
            <div hidden={this.state.memoEditMode}>
              <span
                dangerouslySetInnerHTML={{
                  __html: text2md(this.props.puzzle.memo),
                }}
              />
              <StyledEditButton onClick={this.toggleMemoEditMode}>
                <FormattedMessage {...dialogueMessages.edit} />
              </StyledEditButton>
            </div>
            <div hidden={!this.state.memoEditMode}>
              <PreviewEdit
                content={this.state.memo}
                onChange={this.handleMemoChange}
              />
              <Flex>
                <StyledEditButton
                  onClick={this.handleSaveMemo}
                  style={{ width: '100%' }}
                >
                  <ImgXs src={tick} />
                </StyledEditButton>
                <StyledEditButton
                  onClick={this.toggleMemoEditMode}
                  style={{ width: '100%' }}
                >
                  <ImgXs src={cross} />
                </StyledEditButton>
              </Flex>
            </div>
          </div>
          <div hidden={this.state.activeTab !== 2}>
            <Flex mx={1}>
              <Box w={(1, 5 / 6, 7 / 8)}>
                <StyledTextarea
                  value={this.state.hint}
                  onChange={this.handleHintChange}
                />
              </Box>
              <Box w={(1, 1 / 6, 1 / 8)}>
                <StyledEditButton
                  onClick={this.handleCreateHint}
                  style={{ width: '100%' }}
                >
                  <ImgXs src={tick} />
                </StyledEditButton>
              </Box>
            </Flex>
          </div>
          <div hidden={this.state.activeTab !== 3}>
            <Flex mx={1}>
              <Box w={1 / 3} hidden={this.props.puzzle.status !== 0}>
                <FormattedMessage {...messages.putSolution} />
                <StyledSwitch
                  checked={this.state.solve}
                  onClick={this.handleSolveChange}
                />
              </Box>
              <Box
                w={1 / 3}
                hidden={
                  this.props.puzzle.status !== 1 &&
                  this.props.puzzle.status !== 3
                }
              >
                <FormattedMessage {...messages.toggleHidden} />
                <StyledSwitch
                  checked={this.state.hidden}
                  onClick={this.handleHiddenChange}
                />
              </Box>
              <Box w={1 / 3}>
                <FormattedMessage {...messages.toggleYami} />
                <StyledSwitch
                  checked={this.state.yami}
                  onClick={this.handleYamiChange}
                />
              </Box>
              <Box w={1 / 3}>
                <StyledEditButton
                  onClick={this.handleSaveControl}
                  style={{ width: '100%' }}
                >
                  <ImgXs src={tick} />
                </StyledEditButton>
              </Box>
            </Flex>
          </div>
        </PuzzleFrame>
      </Constrained>
    );
  }
}

PuzzleModifyBox.propTypes = {
  puzzle: PropTypes.object.isRequired,
  currentUserId: PropTypes.number.isRequired,
  puzzleId: PropTypes.number.isRequired,
};

export default PuzzleModifyBox;
