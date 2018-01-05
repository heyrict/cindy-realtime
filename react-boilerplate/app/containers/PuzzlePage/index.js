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

import PuzzleList from "containers/PuzzleList"

export class PuzzlePage extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet>
          <title>PuzzlePage</title>
          <meta name="description" content="Description of PuzzlePage" />
        </Helmet>
        <PuzzleList status={0} />
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

export default compose(
  withReducer,
  withSaga,
  withConnect
)(PuzzlePage);
