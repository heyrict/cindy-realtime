import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getCookie } from './common';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'X-CSRFToken': getCookie('csrftoken'),
  },
  fetchOptions: {
    method: 'POST',
  },
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

const headerLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'X-CSRFToken': getCookie('csrftoken'),
    },
  }));
  return forward(operation);
});

export const client = new ApolloClient({
  link: ApolloLink.from([errorLink, headerLink, httpLink]),
  cache: new InMemoryCache({
    dataIdFromObject: (object) => object.id,
  }),
});

export const tokenizedFetch = (url, content) =>
  fetch(url, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: content,
  }).then((response) => response.json());

export const gqlQuery = (operation, variables) =>
  fetch('/graphql', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => response.json());

/*
const network = Network.create(gqlQuery);

const environment = new Environment({
  network,
  store,
});

export default environment;
*/
