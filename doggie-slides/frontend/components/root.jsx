import React from 'react';
import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';

import App from './app'

export default function Root({store}){
  console.log(store.getState());
  return (
    <Provider store={store}>
      <HashRouter>
        <App/>
      </HashRouter>
    </Provider>
  );
}