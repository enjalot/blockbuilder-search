import './style/main.scss'; // Builds the main CSS file
// import
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './components/app';


var template = (
  <Provider store={store}>
    <App />
  </Provider>
);
ReactDOM.render(template, document.getElementById('search'));
