import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { basicReduxStore } from './reduxStore';

ReactDOM.render(
  <Provider store={basicReduxStore}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
