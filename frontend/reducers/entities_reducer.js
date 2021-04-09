import { combineReducers } from 'redux';
import * as SessionActions from '../actions/session_actions';
import * as PresentationActions from '../actions/presentation_actions';

const TextStyleReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_TEXT: 
      return {...state, ...action.data.textstylesAttributes}
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.textstyles; 
    case PresentationActions.RECEIVE_TEXTSTYLES: 
      return action.textstyles;
    case PresentationActions.RECEIVE_TEXTSTYLE: 
      return {...state, [action.textstyle.id]: action.textstyle};
    default:
      return state;
  }
}

const TextboxsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_TEXT: 
      return {...state, ...action.data}
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.textboxes; 
    case PresentationActions.RECEIVE_TEXTBOXES: 
      return action.textboxes;
    case PresentationActions.RECEIVE_TEXTBOX: 
      return {...state, [action.textbox.id]: action.textbox};
    default:
      return state;
  }
}

const WrapperReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.wrappers;
    case PresentationActions.RECEIVE_WRAPPERS: 
      return action.wrappers;
    case PresentationActions.RECEIVE_WRAPPER: 
      return {...state, [action.wrapper.id]: action.wrapper};
    default:
      return state;
  }
}

const SlidesReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.slides; 
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
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.docs;
    case PresentationActions.RECEIVE_DOCS: 
      return action.docs;
    case PresentationActions.RECEIVE_DOC: 
      return {[action.doc.id]: action.doc};
    default:
      return state;
  }
}

export default combineReducers({docs: DocsReducer, slides: SlidesReducer, wrappers: WrapperReducer, textboxes: TextboxsReducer, textstyles: TextStyleReducer});