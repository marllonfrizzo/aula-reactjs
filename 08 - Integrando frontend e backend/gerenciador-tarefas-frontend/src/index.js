import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:3001/api/";
axios.defaults.withCredentials = true;

const Index = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

ReactDOM.render(<Index />, document.getElementById('root'));
registerServiceWorker();
