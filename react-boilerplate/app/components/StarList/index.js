/**
 *
 * StarList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import Relay from 'react-relay';
import { ButtonOutline } from 'style-store';

import PuzzlePanel from 'components/PuzzlePanel';
import FiveStars from 'components/FiveStars';
import StarListFragment from 'graphql/StarList';
import StarListInitQuery from 'graphql/StarListInitQuery';
import chatMessages from 'containers/Chat/messages';

const StyledButtonOutline = ButtonOutline.extend`
  border-radius: 10px;
  padding: 10px 0;
`;

export class StarList extends React.Component {
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(10, (error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        {this.props.list.allStars.edges.map((edge) => (
          <PuzzlePanel
            node={edge.node.puzzle}
            key={edge.node.id}
            additional={
              <FiveStars
                value={edge.node.value}
                starSize="15px"
                justify="center"
              />
            }
          />
        ))}
        {this.props.relay.hasMore() && (
          <StyledButtonOutline onClick={this.loadMore} w={1}>
            <FormattedMessage {...chatMessages.loadMore} />
          </StyledButtonOutline>
        )}
      </div>
    );
  }
}

StarList.propTypes = {
  relay: PropTypes.object.isRequired,
  list: PropTypes.object.isRequired,
};

const withStarList = (Component) =>
  Relay.createPaginationContainer(Component, StarListFragment, {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.list && props.list.allStars;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        user: fragmentVariables.user,
      };
    },
    query: StarListInitQuery,
  });

export default compose(withStarList)(StarList);
