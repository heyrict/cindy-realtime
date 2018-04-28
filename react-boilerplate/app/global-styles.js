import 'react-select/dist/react-select.css';
import 'react-tippy/dist/tippy.css';
import 'tippy-custom.css';
import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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

  hr {
    border-top: 1px solid sienna;
    margin: 10px;
  }

  // modal stuff
  .modal-shade {
    display: none;
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
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: none;
    justify-content: center;
    align-items: center;
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
