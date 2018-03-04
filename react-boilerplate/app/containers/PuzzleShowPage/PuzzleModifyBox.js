import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import bootbox from 'bootbox';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Tabs, TabItem, Flex, Box } from 'rebass';
import Constrained from 'components/Constrained';
import { text2md } from 'common';
import dialogueMessages from 'containers/Dialogue/messages';
import PreviewEdit from 'components/PreviewEdit';

import { graphql } from 'react-apollo';
import createHintMutation from 'graphql/CreateHintMutation';
import puzzleUpdateMutation from 'graphql/UpdatePuzzleMutation';

import tick from 'images/tick.svg';
import cross from 'images/cross.svg';
import { ImgXs, PuzzleFrame, EditButton, Switch, Textarea } from 'style-store';
import messages from './messages';

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
      solve: props.puzzle.status === 3,
      yami: props.puzzle.yami,
      hidden: props.puzzle.status === 3,
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
      this.setState((p) => ({
        solve: !p.solve,
        hidden: p.solve ? false : p.hidden,
      }));
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
    this.props
      .mutatePuzzleUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            solution: this.state.solution,
          },
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

  handleSaveMemo() {
    this.toggleMemoEditMode();
    if (this.state.memo === this.props.puzzle.memo) return;
    this.props
      .mutatePuzzleUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            memo: this.state.memo,
          },
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

  handleSaveControl() {
    let status;
    if (this.state.solve) status = 1;
    if (this.state.hidden) status = 3;
    this.props
      .mutatePuzzleUpdate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            yami: this.state.yami,
            status,
          },
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

  handleCreateHint() {
    if (this.state.hint === '') return;
    this.props
      .mutateHintCreate({
        variables: {
          input: {
            puzzleId: this.props.puzzleId,
            content: this.state.hint,
          },
        },
      })
      .then(() => {
        this.setState({ hint: '' });
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
      <Constrained level={3}>
        <PuzzleFrame>
          <StyledTabs>
            {this.props.puzzle.status === 0 && (
              <StyledTabItem
                active={this.state.activeTab === 0}
                onClick={() => this.changeTab(0)}
              >
                <FormattedMessage {...messages.solution} />
              </StyledTabItem>
            )}
            <StyledTabItem
              active={this.state.activeTab === 1}
              onClick={() => this.changeTab(1)}
            >
              <FormattedMessage {...messages.memo} />
            </StyledTabItem>
            {this.props.puzzle.status === 0 && (
              <StyledTabItem
                active={this.state.activeTab === 2}
                onClick={() => this.changeTab(2)}
              >
                <FormattedMessage {...messages.hint} />
              </StyledTabItem>
            )}
            <StyledTabItem
              active={this.state.activeTab === 3}
              onClick={() => this.changeTab(3)}
            >
              <FormattedMessage {...messages.controlPanel} />
            </StyledTabItem>
          </StyledTabs>
          {this.state.activeTab === 0 && (
            <div>
              <div hidden={this.state.solutionEditMode}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: text2md(this.props.puzzle.solution),
                  }}
                />
                <EditButton onClick={this.toggleSolutionEditMode}>
                  <FormattedMessage {...dialogueMessages.edit} />
                </EditButton>
              </div>
              <div hidden={!this.state.solutionEditMode}>
                <PreviewEdit
                  content={this.state.solution}
                  onChange={this.handleSolutionChange}
                />
                <Flex>
                  <EditButton
                    onClick={this.handleSaveSolution}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={tick} />
                  </EditButton>
                  <EditButton
                    onClick={this.toggleSolutionEditMode}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={cross} />
                  </EditButton>
                </Flex>
              </div>
            </div>
          )}
          {this.state.activeTab === 1 && (
            <div>
              <div hidden={this.state.memoEditMode}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: text2md(this.props.puzzle.memo),
                  }}
                />
                <EditButton onClick={this.toggleMemoEditMode}>
                  <FormattedMessage {...dialogueMessages.edit} />
                </EditButton>
              </div>
              <div hidden={!this.state.memoEditMode}>
                <PreviewEdit
                  content={this.state.memo}
                  onChange={this.handleMemoChange}
                />
                <Flex>
                  <EditButton
                    onClick={this.handleSaveMemo}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={tick} />
                  </EditButton>
                  <EditButton
                    onClick={this.toggleMemoEditMode}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={cross} />
                  </EditButton>
                </Flex>
              </div>
            </div>
          )}
          {this.state.activeTab === 2 && (
            <div>
              <Flex mx={1}>
                <Box w={(1, 5 / 6, 7 / 8)}>
                  <Textarea
                    value={this.state.hint}
                    onChange={this.handleHintChange}
                  />
                </Box>
                <Box w={(1, 1 / 6, 1 / 8)}>
                  <EditButton
                    onClick={this.handleCreateHint}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={tick} />
                  </EditButton>
                </Box>
              </Flex>
            </div>
          )}
          {this.state.activeTab === 3 && (
            <div>
              <Flex mx={1}>
                <Box w={1 / 3} hidden={this.props.puzzle.status !== 0}>
                  <FormattedMessage {...messages.putSolution} />
                  <Switch
                    checked={this.state.solve}
                    onClick={this.handleSolveChange}
                  />
                </Box>
                <Box
                  w={1 / 3}
                  hidden={
                    this.props.puzzle.status !== 1 &&
                    this.props.puzzle.status !== 3 &&
                    (this.props.puzzle.status === 0 &&
                      this.state.solve === false)
                  }
                >
                  <FormattedMessage {...messages.toggleHidden} />
                  <Switch
                    checked={this.state.hidden}
                    onClick={this.handleHiddenChange}
                  />
                </Box>
                <Box w={1 / 3}>
                  <FormattedMessage {...messages.toggleYami} />
                  <Switch
                    checked={this.state.yami}
                    onClick={this.handleYamiChange}
                  />
                </Box>
                <Box w={1 / 3}>
                  <EditButton
                    onClick={this.handleSaveControl}
                    style={{ width: '100%' }}
                  >
                    <ImgXs src={tick} />
                  </EditButton>
                </Box>
              </Flex>
            </div>
          )}
        </PuzzleFrame>
      </Constrained>
    );
  }
}

PuzzleModifyBox.propTypes = {
  puzzle: PropTypes.object.isRequired,
  puzzleId: PropTypes.number.isRequired,
  mutatePuzzleUpdate: PropTypes.func.isRequired,
  mutateHintCreate: PropTypes.func.isRequired,
};

const withPuzzleUpdateMutation = graphql(puzzleUpdateMutation, {
  name: 'mutatePuzzleUpdate',
});

const withHintCreateMutation = graphql(createHintMutation, {
  name: 'mutateHintCreate',
});

export default compose(withPuzzleUpdateMutation, withHintCreateMutation)(
  PuzzleModifyBox
);
