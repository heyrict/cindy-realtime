import React from 'react';
import PropTypes from 'prop-types';
import bootbox from 'bootbox';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { to_global_id as t } from 'common';
import { Box, Flex } from 'rebass';
import Constrained from 'components/Constrained';
import { ButtonOutline, AutoResizeTextarea } from 'style-store';
import { OPTIONS_SEND } from 'containers/Settings/constants';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import putQuestionMutation from 'graphql/CreateQuestionMutation';
import UserLabel from 'graphql/UserLabel';
import DialoguePanel from 'graphql/DialoguePanel';

import messages from './messages';

class QuestionPutBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      loading: false,
    };
    this.handleKeyDown = (e) => {
      if (e.key === 'Enter') this.handleSubmit();
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = (e) => this.setState({ content: e.target.value });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleKeyPress(e) {
    const content = this.state.content;
    switch (this.props.sendPolicy) {
      case OPTIONS_SEND.NONE:
        break;
      case OPTIONS_SEND.ON_SHIFT_RETURN:
        if (e.nativeEvent.keyCode === 13 && e.nativeEvent.shiftKey) {
          this.handleSubmit();
        }
        break;
      case OPTIONS_SEND.ON_RETURN:
        if (e.nativeEvent.keyCode === 13 && !e.nativeEvent.shiftKey) {
          if (content[content.length - 1] === '\n') {
            this.handleSubmit();
          }
        }
        break;
      default:
    }
  }

  handleSubmit() {
    if (this.state.loading) return;
    if (!this.props.currentUserId) return;
    const { puzzleId, currentUser } = this.props;
    const content = this.state.content.trimRight();
    if (content === '') return;
    this.setState({ content: '', loading: true });

    const query = gql`
      query {
        puzzleShowUnion(id: $id)
          @connection(key: "PuzzleShowUnion_PuzzleShowUnion", filter: ["id"]) {
          edges {
            node {
              ... on DialogueNode {
                ...DialoguePanel
              }

              ... on HintNode {
                id
                content
                created
              }
            }
          }
        }
      }
      ${DialoguePanel}
    `;

    this.props
      .mutate({
        variables: {
          input: {
            content,
            puzzleId,
          },
        },
        update(proxy, { data: { createQuestion: { dialogue } } }) {
          let update = false;
          const id = t('PuzzleNode', puzzleId);
          const data = proxy.readQuery({
            query,
            variables: { id },
          });
          const responseData = {
            __typename: 'PuzzleShowUnionEdge',
            node: {
              good: false,
              true: false,
              question: content,
              user: currentUser,
              answer: null,
              questionEditTimes: 0,
              answerEditTimes: 0,
              answeredtime: null,
              ...dialogue,
            },
          };
          data.puzzleShowUnion.edges = data.puzzleShowUnion.edges.map(
            (edge) => {
              if (edge.node.id === responseData.node.id) {
                update = true;
                return responseData;
              }
              return edge;
            }
          );
          if (!update) {
            data.puzzleShowUnion.edges.push(responseData);
          }
          proxy.writeQuery({ query, variables: { id }, data });
        },
      })
      .then(() => {})
      .catch((error) => {
        this.setState({ content });
        bootbox.alert(error.message);
      });
    this.setState({ loading: false });
  }

  render() {
    return (
      <Constrained level={3}>
        <Flex mx={-1}>
          <FormattedMessage
            {...messages[this.props.currentUserId ? 'input' : 'disableInput']}
          >
            {(msg) => (
              <AutoResizeTextarea
                style={{ minHeight: '48px' }}
                value={this.state.content}
                disabled={this.props.currentUserId === undefined}
                placeholder={msg}
                onChange={this.handleChange}
                onKeyUp={this.handleKeyPress}
              />
            )}
          </FormattedMessage>
          <Box>
            <FormattedMessage {...messages.putQuestion}>
              {(msg) => (
                <ButtonOutline
                  onClick={this.handleSubmit}
                  disabled={!this.props.currentUserId}
                  style={{ wordBreak: 'keep-all' }}
                >
                  {msg}
                </ButtonOutline>
              )}
            </FormattedMessage>
          </Box>
        </Flex>
      </Constrained>
    );
  }
}

QuestionPutBox.propTypes = {
  mutate: PropTypes.func.isRequired,
  puzzleId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number,
  currentUser: PropTypes.object,
  sendPolicy: PropTypes.string.isRequired,
};

const withMutation = graphql(putQuestionMutation);

const withCurrentUser = graphql(
  gql`
    query($id: ID!) {
      user(id: $id) {
        ...UserLabel_user
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ currentUserId }) => ({
      variables: {
        id: t('UserNode', currentUserId || '-1'),
      },
    }),
    props({ data }) {
      const { user: currentUser } = data;
      return { currentUser };
    },
  }
);

export default compose(withCurrentUser, withMutation)(QuestionPutBox);
