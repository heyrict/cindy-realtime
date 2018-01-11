import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { getCookie } from './common';

const store = new Store(new RecordSource());

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

const network = Network.create(gqlQuery);

const environment = new Environment({
  network,
  store,
});

export default environment;
