import React from 'react'
import ReactDOM from 'react-dom'

import configureStore from './store/store';
import Root from './components/root'

document.addEventListener('DOMContentLoaded', () => {
  let store;

  if (window.currentUser){
    console.log(window.currentUser);
    store = configureStore({ session: {...window.currentUser} });
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  ReactDOM.render(<Root store={store}/>, document.getElementById('root'));
})