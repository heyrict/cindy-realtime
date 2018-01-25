import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: normal;
    padding-top: 50px;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    min-height: 100%;
    min-width: 100%;
    background-color: blanchedalmond;
  }

  p,
  label {
    //font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  a:focus,
  a:hover {
    color: inherit;
  }

  table {
    border: 2px solid;
  }

  th {
    border: 2px solid;
  }

  td {
    border: 1px solid;
  }
`;
