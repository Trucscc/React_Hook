import React from 'react';
import ReactDOM from 'react-dom/client';

import { store } from './app/store';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import Router from './router/Router';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    {/* <React.StrictMode> */}
    <Provider store={store}>
        <Router />
        {/* <App /> */}
      </Provider>
    {/* </React.StrictMode> */}
  </>
);