import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import App from './app/app';

ReactDOM.render(
    <BrowserRouter basename="/admin">
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
