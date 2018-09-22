/**
 *
 * EventList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { compose } from 'redux';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserLabel from 'graphql/UserLabel';

import EventBanner from './EventBanner';

function EventList(props) {
  return (
    <div>
      {props.allEvents &&
        props.allEvents.edges.map((edge) => (
          <EventBanner node={edge.node} key={edge.node.id} />
        ))}
    </div>
  );
}

EventList.propTypes = {
  allEvents: PropTypes.shape({
    edges: PropTypes.array.isRequired,
  }),
};

const withEventList = graphql(
  gql`
    query EventListQuery($endTime_Gt: DateTime, $orderBy: [String]) {
      allEvents(endTime_Gt: $endTime_Gt, orderBy: $orderBy) {
        edges {
          node {
            id
            user {
              ...UserLabel_user
            }
            title
            bannerImgUrl
            status
            startTime
            endTime
            pageLink
          }
        }
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ variables, fetchPolicy }) => ({
      variables: {
        ...variables,
      },
      fetchPolicy,
    }),
    props({ data }) {
      const { loading, allEvents } = data;
      return {
        loading,
        allEvents,
      };
    },
  },
);

export default compose(withEventList)(EventList);
