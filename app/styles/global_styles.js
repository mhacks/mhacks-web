import { injectGlobal } from 'styled-components';
import Theme from './theme.js';

// uses some bootstrap defaults
injectGlobal`
body {
    margin: 0px;
    font-family: ${Theme.primaryFont}, sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
}

*:focus { outline: none; }

* { box-sizing: border-box; }

button { overflow: visible; }

button, select {
  text-transform: none;
}

button, html input[type="button"], input[type="reset"], input[type="submit"] {
  cursor: pointer;
}

button[disabled], html input[disabled] {
  cursor: default;
}

button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}

h1, h2, h3, h4, h5, h6 {
    line-height: 1.1;
    color: inherit;
}

h2, h3 {
    font-weight: 300;
}

h4, h5, h6 {
    font-weight: 200;
    margin-top: 10px;
    margin-bottom: 10px;
}

h1 {
    font-size: 36px;
    margin-bottom: 10px;
    font-weight: 500;
}

h2 { font-size: 30px; }

h3 { font-size: 24px; }

h4 { font-size: 18px; }

h5 { font-size: 14px; }

h6 { font-size: 12px; }

p {
    font-size: 14px;
    font-weight: 100;
}
`;
