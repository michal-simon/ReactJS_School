
//require('es6-promise').polyfill();

import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Router, browserHistory } from 'react-router';
import configureStore from './store/configureStore.js';
import getRoutes from './routes.js';

const store 	= configureStore(window.INITIAL_STATE); //this is the original 

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={getRoutes(store)}/>
  </Provider>,
  document.getElementById('root')
);
//registerServiceWorker();