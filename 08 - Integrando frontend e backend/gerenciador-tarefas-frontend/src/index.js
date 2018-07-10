import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:3001";

const index = () => {
    <BrowserRouter>
        <App />
    </BrowserRouter>
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
