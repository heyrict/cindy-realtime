/*
 *
 * PuzzleList constants
 *
 */

import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const DEFAULT_ACTION = "app/PuzzleList/DEFAULT_ACTION";

const PuzzleAllQuery = gql`
  query PuzzleAllQuery {
    allPuzzles(status: $status, status_Gt: $status__gt) {
      edges {
        node {
          id
          rowid
          title
        }
      }
    }
  }
`;
