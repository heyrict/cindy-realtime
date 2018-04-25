/**
 *
 * PuzzleDescribeList
 *
 */

/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserLabel from 'graphql/UserLabel';

import Constrained from 'components/Constrained';
import RewardingModalComponent from 'components/RewardingModal/RewardingModalComponent';
import LoadingDots from 'components/LoadingDots';

const LightBg = styled.div`
  background: burlywood;
  padding: 10px;
  margin-bottom: 50px;
  border-radius: 10px;
`;

export function PuzzleDescribeList(props) {
  if (props.loading || !props.allPuzzles) {
    return <LoadingDots py={50} size={8} />;
  }
  return (
    <Constrained level={5} pt={3}>
      {props.allPuzzles.edges.map((edge) => (
        <LightBg key={edge.node.id}>
          <RewardingModalComponent {...edge.node} />
        </LightBg>
      ))}
    </Constrained>
  );
}

PuzzleDescribeList.propTypes = {
  loading: PropTypes.bool.isRequired,
  allPuzzles: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  itemsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

PuzzleDescribeList.defaultProps = {
  page: 1,
  itemsPerPage: 10,
  changePage: () => {},
};

const withPuzzleList = graphql(
  gql`
    query PuzzleDescribeListQuery(
      $orderBy: [String]
      $offset: Int
      $limit: Int
      $year: Int
      $month: Int
    ) {
      allPuzzles(
        orderBy: $orderBy
        offset: $offset
        limit: $limit
        created_Year: $year
        created_Month: $month
      ) {
        edges {
          node {
            id
            title
            genre
            yami
            user {
              ...UserLabel_user
            }
            content
            commentSet {
              edges {
                node {
                  id
                  spoiler
                  content
                  user {
                    ...UserLabel_user
                  }
                }
              }
            }
          }
        }
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ variables, fetchPolicy, itemsPerPage }) => ({
      variables: {
        limit: itemsPerPage,
        ...variables,
      },
      fetchPolicy,
    }),
    props({ data }) {
      const { loading, allPuzzles } = data;
      return {
        loading,
        allPuzzles,
      };
    },
  }
);

export default compose(withPuzzleList)(PuzzleDescribeList);
