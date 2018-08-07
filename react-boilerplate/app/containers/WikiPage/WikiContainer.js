/**
 *
 * WikiContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { to_global_id as t, text2md } from 'common';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { Panel } from 'rebass';
import LoadingDots from 'components/LoadingDots';

import messages from './messages';

function WikiContainer(props) {
  if (props.loading) {
    return <LoadingDots p={50} m={2} />;
  }
  return (
    <Panel style={{ border: '5px solid #728905' }} px={2}>
      {props.wiki && (
        <span
          dangerouslySetInnerHTML={{
            __html: text2md(props.wiki.content, true),
          }}
        />
      )}
    </Panel>
  );
}

WikiContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  wiki: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
};

const withData = graphql(
  gql`
    query WikiPageQuery($id: ID!) {
      wiki(id: $id) {
        id
        content
      }
    }
  `,
  {
    options: ({ path }) => ({
      variables: {
        id: t('WikiNode', path),
      },
      fetchPolicy: 'cache-first',
    }),
    props({ data }) {
      const { wiki, loading, error } = data;
      return {
        wiki,
        loading,
        error,
      };
    },
  },
);

export default compose(withData)(WikiContainer);
