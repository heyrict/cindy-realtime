import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import UserLabel from 'graphql/UserLabel';

export const withCommentList = graphql(
  gql`
    query CommentListQuery(
      $orderBy: [String]
      $limit: Int
      $offset: Int
      $puzzle_Status_Gt: Float
      $puzzle_User: ID
      $user: ID
    ) {
      allCommentsLo(
        orderBy: $orderBy
        limit: $limit
        offset: $offset
        puzzle_Status_Gt: $puzzle_Status_Gt
        puzzle_User: $puzzle_User
        user: $user
      ) {
        edges {
          node {
            id
            user {
              ...UserLabel_user
            }
            puzzle {
              id
              title
              user {
                ...UserLabel_user
              }
            }
            content
            spoiler
          }
        }
        totalCount
      }
    }
    ${UserLabel}
  `,
  {
    options: ({ variables, fetchPolicy, page, itemsPerPage }) => ({
      variables: {
        limit: itemsPerPage,
        offset: itemsPerPage * (page - 1),
        ...variables,
      },
      fetchPolicy,
    }),
    props({ data }) {
      const { loading, allCommentsLo } = data;
      return {
        loading,
        allComments: allCommentsLo,
      };
    },
  },
);
