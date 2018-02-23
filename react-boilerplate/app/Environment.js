import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import introspectionQueryResultData from '../fragmentTypes.json';
import { getCookie } from './common';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
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

const wsLink = new WebSocketLink({
  uri: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${
    window.location.host
  }/ws/`,
  options: {
    reconnect: true,
  },
});

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    headerLink,
    split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink
    ),
  ]),
  cache: new InMemoryCache({
    dataIdFromObject: (object) => object.id,
    fragmentMatcher,
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
