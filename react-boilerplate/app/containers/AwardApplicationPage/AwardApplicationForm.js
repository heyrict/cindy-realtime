import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { line2md } from 'common';
import { FormattedMessage, intlShape } from 'react-intl';
import { Flex, Box } from 'rebass';
import Select from 'react-select';
import { RoundedPanel, ButtonOutline, Textarea } from 'style-store';
import LoadingDots from 'components/LoadingDots';

import { graphql } from 'react-apollo';
import CreateAwardApplication from 'graphql/CreateAwardApplicationMutation';
import AwardApplicationList from 'graphql/AwardApplicationList';
import AwardList from 'graphql/AwardList';
import { nAlert } from 'containers/Notifier/actions';

import messages from './messages';

const StyledBtn = styled(ButtonOutline)`
  padding: 5px;
  min-width: 30px;
`;

class AwardApplicationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      awardId: null,
      comment: '',
    };
    this.setAward = ({ value: awardId, description, requisition }) => {
      this.setState({ awardId });
      this.currentDescription = description;
      this.currentRequisition = requisition;
    };
    this.handleCommentChange = (e) => {
      this.setState({ comment: e.target.value });
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    const _ = this.context.intl.formatMessage;
    const { awardId, comment } = this.state;
    if (!awardId || !comment) {
      this.props.alert(_(messages.formBlankAlert));
      return;
    }
    this.props
      .mutate({
        variables: {
          input: { awardId, comment },
        },
        update(
          proxy,
          {
            data: {
              createAwardApplication: { awardApplication },
            },
          },
        ) {
          const data = proxy.readQuery({
            query: AwardApplicationList,
            variables: {
              orderBy: ['status', '-id'],
            },
          });
          data.allAwardApplications.edges = [
            {
              __typename: 'AwardApplicationNodeEdge',
              node: awardApplication,
            },
            ...data.allAwardApplications.edges,
          ];
          proxy.writeQuery({
            query: AwardApplicationList,
            variables: {
              orderBy: ['status', '-id'],
            },
            data,
          });
        },
      })
      .catch((error) => {
        this.props.alert(error.message);
      });
  }
  render() {
    if (this.props.loading) {
      return <LoadingDots />;
    }
    return (
      <RoundedPanel p={1} m={1}>
        <Flex flexWrap="wrap">
          <Box w={1}>
            <FormattedMessage {...messages.selectPlaceholder}>
              {(text) => (
                <Select
                  name="award-select"
                  value={this.state.awardId}
                  placeholder={text}
                  onChange={this.setAward}
                  clearable={false}
                  options={this.props.allAwards.edges.map((edge) => ({
                    value: edge.node.id,
                    label: edge.node.name,
                    description: edge.node.description,
                    requisition: edge.node.requisition,
                  }))}
                />
              )}
            </FormattedMessage>
          </Box>
          <Box w={1} mb={1} style={{ minHeight: '50px' }}>
            <b>
              <FormattedMessage {...messages.awardDescription} />:
            </b>{' '}
            <div
              dangerouslySetInnerHTML={{
                __html: line2md(this.currentDescription || ''),
              }}
            />
          </Box>
          <Box w={1} mb={1} style={{ minHeight: '50px' }}>
            <b>
              <FormattedMessage {...messages.awardRequisition} />:
            </b>{' '}
            <div
              dangerouslySetInnerHTML={{
                __html: line2md(this.currentRequisition || ''),
              }}
            />
          </Box>
          <Box w={1}>
            <FormattedMessage {...messages.commentPlaceholder}>
              {(text) => (
                <Textarea
                  value={this.state.comment}
                  onChange={this.handleCommentChange}
                  placeholder={text}
                />
              )}
            </FormattedMessage>
          </Box>
          <StyledBtn w={1} onClick={this.handleSubmit}>
            <FormattedMessage {...messages.apply} />
          </StyledBtn>
        </Flex>
      </RoundedPanel>
    );
  }
}

AwardApplicationForm.contextTypes = {
  intl: intlShape,
};

AwardApplicationForm.propTypes = {
  allAwards: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  mutate: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  alert: (message) => dispatch(nAlert(message)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

const withMutation = graphql(CreateAwardApplication);

const withData = graphql(AwardList, {
  options: {
    variables: {
      groupName: 'appliable',
    },
  },
  props({ data }) {
    const { loading, allAwards } = data;
    return {
      loading,
      allAwards,
    };
  },
});

export default compose(
  withData,
  withMutation,
  withConnect,
)(AwardApplicationForm);
