import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { Tabs, TabItem } from 'rebass';
import Constrained from 'components/Constrained';
import { text2md } from 'common';
import dialogueMessages from 'containers/Dialogue/messages';
import PreviewEdit from 'components/PreviewEdit';

import { StyledEditButton } from 'containers/Dialogue/Answer';
import { PuzzleFrame } from './Frame';

const StyledTabItem = styled(TabItem)`
  color: #b928d7;
  cursor: pointer;
  &:hover {
    color: #6c71c4;
  }
`;

const StyledTabs = styled(Tabs)`
  border-color: #b928d7;
`;

class PuzzleModifyBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
      solution: props.puzzle.solution,
      memo: props.puzzle.memo,
      solutionEditMode: false,
      memoEditMode: props.puzzle.memo === null,
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
  }

  render() {
    return (
      <Constrained level={3}>
        <PuzzleFrame>
          <StyledTabs>
            <StyledTabItem
              active={this.state.activeTab === 0}
              onClick={() => this.changeTab(0)}
            >
              Control Panel
            </StyledTabItem>
            <StyledTabItem
              active={this.state.activeTab === 1}
              onClick={() => this.changeTab(1)}
            >
              Solution
            </StyledTabItem>
            <StyledTabItem
              active={this.state.activeTab === 2}
              onClick={() => this.changeTab(2)}
            >
              Memo
            </StyledTabItem>
          </StyledTabs>
          <div hidden={this.state.activeTab !== 1}>
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
              <StyledEditButton onClick={this.toggleSolutionEditMode}>
                Save
              </StyledEditButton>
            </div>
          </div>
          <div hidden={this.state.activeTab !== 2}>
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
          </div>
        </PuzzleFrame>
      </Constrained>
    );
  }
}

PuzzleModifyBox.propTypes = {
  puzzle: PropTypes.object.isRequired,
  currentUserId: PropTypes.number.isRequired,
};

export default PuzzleModifyBox;
