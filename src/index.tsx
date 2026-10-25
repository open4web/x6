import 'proxy-polyfill';

import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

import App from './App';
import { installClientHeaders } from './utils/clientHeaders';

installClientHeaders();

ReactDOM.render(<App />, document.getElementById('root'));
