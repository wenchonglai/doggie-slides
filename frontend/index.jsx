import React from 'react'
import ReactDOM from 'react-dom'

import configureStore from './store/store';
import Root from './components/root'
import { bisectLeft, bisectRight } from './utils/data-structure/bisect';
import SortedMap from './utils/data-structure/sorted-map';

window.bisectLeft = bisectLeft;
window.bisectRight = bisectRight;
window.SortedMap = SortedMap;

document.addEventListener('DOMContentLoaded', () => {
  let store;

  if (window.currentUser){
    store = configureStore({ session: {...window.currentUser} });
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  ReactDOM.render(<Root store={store}/>, document.getElementById('root'));
})