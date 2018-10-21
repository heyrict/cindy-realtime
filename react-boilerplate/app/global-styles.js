import 'react-select/dist/react-select.css';
import 'react-tippy/dist/tippy.css';
import 'tippy-custom.css';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    background-color: blanchedalmond;
    font-family: 'Noto Sans CJK JP','Dejavu Sans',Inconsolata,Consolas,Helvetica,Arial,sans-serif;
    overscroll-behavior: contain;
    @media (max-width: 400px) {
      font-size: 13px;
    }
  }

  body {
    line-height: normal;
    padding-top: 50px;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .form-control {
    background-color: rgba(255, 255, 255, 0.618);
  }

  #app {
    min-height: 100%;
    min-width: 100%;
    background-color: blanchedalmond;
  }

  h1 { font-size: 1.8em }
  h2 { font-size: 1.5em }
  h3 { font-size: 1.2em }

  p,
  label {
    //font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  a {
    text-decoration: none;
    color: #4877d7;
  }
  button, a {
    cursor: pointer;
    padding: 0;
  }

  a:focus,
  a:hover {
    color: inherit;
  }

  input:disabled, textarea:disabled {
    opacity: 0.25;
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

  hr {
    border-top: 1px solid sienna;
    margin: 10px;
  }

  pre {
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    font-size: 13px;
    line-height: 19px;
    overflow: auto;
    padding: 6px 10px;
    border-radius: 3px;
  }
  code {
    margin: 0 2px;
    padding: 0 5px;
    white-space: nowrap;
    border: 1px solid #eaeaea;
    background-color: #f8f8f8;
    border-radius: 3px;
    font-family: Consolas, "Liberation Mono", Courier, monospace;
    font-size: 12px;
    color: #52676f;
  }
  pre > code {
    margin: 0;
    padding: 0;
    white-space: pre;
    border: 0;
    background: transparent;
  }

  .widthfull {
    width: 100%;
  }
  .clear-fix {
    clear: both;
  }

  // cindy stamp stuff
  .cindy-stamp-middle {
    height: 4em;
  }

  .cindy-frame-icon {
    display: inline-block;
    float: left;
    margin: 0 5px;
  }

  // modal stuff
  .modal-shade {
    display: none;
    z-index: 5000;
    opacity: 0;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.4) 0, rgba(0,0,0,0.8) 100%);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    will-change: opacity;
  }

  .modal-container {
    position: fixed;
    z-index: 9999;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    display: none;
    justify-content: center;
    overflow-y: auto;
    align-items: flex-start;
  }
  .modal-container > .modal {
     opacity: 0;
     box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
     background: #d7c682;
     border-radius: 5px;
     padding: 0;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
     @media (min-width: 400px) {
       width: 95%;
     }
     @media (min-width: 760px) {
       width: 88%;
     }
     @media (min-width: 1024px) {
       width: 76%;
     }
   }
   .modal-container > .modal-actions { 
     align-self: flex-end;
   }

  // bootstrap stuff
  .nav {
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
  }
  .nav::before, .nav::after {
    display: table;
    clear: both;
  }
  .nav-tabs {
    border-bottom: 1px solid #ddd;
    display: inline-table;
  }
  .nav-tabs > li {
    float: left;
    margin-bottom: -1px;
  }
  .nav > li {
    position: relative;
    display: block;
  }
  .nav > li > a {
    position: relative;
    display: block;
    padding: 10px 15px;
  }
  .nav-tabs > li > a {
    margin-right: 2px;
    line-height: 1.428571;
    border-radius: 4px 4px 0 0;
    border: 1px solid transparent;
  }
  .nav-tabs > li.active > a,
  .nav-tabs > li.active > a:focus,
  .nav-tabs > li.active > a:hover {
    color: #555;
    cursor: default;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: transparent;
  }
  .tab-content > .tab-pane {
    display: none;
  }
  .tab-content > .active {
    display: block;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
    line-height: 1.1;
  }
  h1, h2, h3 {
    margin-top: 20px;
    margin-bottom: 10px;
  }
`;

throw new Error(
  "An injectGlobal usage was converted to createGlobalStyles via codemod but needs to be hooked up. See https://www.styled-components.com/docs/api#createglobalstyle for instructions."
);
