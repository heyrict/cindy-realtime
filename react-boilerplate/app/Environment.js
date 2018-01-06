import { Environment, Network, RecordSource, Store } from "relay-runtime";
import common from "./common";

const store = new Store(new RecordSource());

const network = Network.create((operation, variables) => {
  return fetch("/graphql", {
    credentials: "same-origin",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": common.getCookie("csrftoken")
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  }).then(response => {
    return response.json();
  });
});

const environment = new Environment({
  network,
  store
});

export default environment;
