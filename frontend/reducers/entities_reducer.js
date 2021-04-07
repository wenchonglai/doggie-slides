import { combineReducers } from 'redux';
import * as SessionActions from '../actions/session_actions';
import * as PresentationActions from '../actions/presentation_actions';

const SlidesReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_SLIDES: 
      return action.slides;
    case PresentationActions.RECEIVE_SLIDE: 
      return {...state, [action.slide.id]: action.slide};
    default:
      return state;
  }
}

const DocsReducer = (state = {}, action) => {
  Object.freeze(state);
  
  switch (action.type){
    case PresentationActions.RECEIVE_DOCS: 
      return action.docs;
    case PresentationActions.RECEIVE_DOC: 
      return {[action.doc.id]: action.doc};
    default:
      return state;
  }
}

export default combineReducers({docs: DocsReducer, slides: SlidesReducer});