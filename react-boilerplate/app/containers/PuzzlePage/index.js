/**
 *
 * PuzzlePage
 *
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";

import injectSaga from "utils/injectSaga";
import injectReducer from "utils/injectReducer";
import makeSelectPuzzlePage from "./selectors";
import reducer from "./reducer";
import saga from "./saga";
import messages from "./messages";
import environment from "Environment";
import { QueryRenderer } from "react-relay";
import { ProgressBar } from "react-bootstrap";

import PuzzleList from "containers/PuzzleList";
import { PuzzleListInitQuery } from "containers/PuzzleList";

export class PuzzlePage extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title>PuzzlePage</title>
          <meta name="description" content="Description of PuzzlePage" />
        </Helmet>
        <QueryRenderer
          environment={environment}
          component={PuzzleList}
          query={PuzzleListInitQuery}
          variables={{
            orderBy: ["-modified", "-id"],
            count: null,
            status: 0,
            status__gt: null
          }}
          render={({ error, props }) => {
            if (error) {
              return <div>{error.message}</div>;
            } else if (props) {
              return <PuzzleList list={props} />;
            }
            return (
              <ProgressBar now={100} label={"Loading..."} striped active />
            );
          }}
        />
        <QueryRenderer
          environment={environment}
          component={PuzzleList}
          query={PuzzleListInitQuery}
          variables={{
            orderBy: ["-modified", "-id"],
            count: 3,
            status: null,
            status__gt: 0
          }}
          render={({ error, props }) => {
            if (error) {
              return <div>{error.message}</div>;
            } else if (props) {
              return <PuzzleList list={props} />;
            }
            return (
              <ProgressBar now={100} label={"Loading..."} striped active />
            );
          }}
        />
      </div>
    );
  }
}

PuzzlePage.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  puzzlepage: makeSelectPuzzlePage()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: "puzzlePage", reducer });
const withSaga = injectSaga({ key: "puzzlePage", saga });

export default compose(withReducer, withSaga, withConnect)(PuzzlePage);
