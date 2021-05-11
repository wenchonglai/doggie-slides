import { combineReducers } from 'redux';
import * as SessionActions from '../actions/session_actions';
import * as PresentationActions from '../actions/presentation_actions';
import * as UIActions from '../actions/ui_actions'
import { getTextstylesByTextboxId } from '../selectors/selectors';

const ImagesReducer = (state = {}, action) => {
  switch (action.type){
    case PresentationActions.RECEIVE_IMAGE:
      return {...state, [action.imageData.id]: action.imageData};
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.images; 
    default: return state;
  }
}

const TextStyleReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type){
    case UIActions.RECEIVE_SELECTED_TEXT: { 
      return {...state, ...action.textstyleData};
    }
    case PresentationActions.RECEIVE_TEXT: 
      return {...state, ...action.textData.textstylesAttributes}
    // case PresentationActions.RECEIVE_TEXTSTYLES: 
    //   return action.textstyles;
    // case PresentationActions.RECEIVE_TEXTSTYLE: 
    //   return {...state, [action.textstyle.id]: action.textstyle};
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.textstyles; 
    default:
      return state;
  }
}

const TextboxReducer = (state = {}, action) => {
  switch (action.type){
    case UIActions.RECEIVE_SELECTED_TEXT:
      return {...state, ...action.textboxData};
    case PresentationActions.RECEIVE_TEXT: {
      const {id, text, textstyleIds} = action.textData;
      return {...state,
        [id]: {id, text, textstyleIds}
      }
    }
    case PresentationActions.RECEIVE_ENTITIES:
      return action.entities.textboxes; 
    // case PresentationActions.RECEIVE_TEXTBOXES: 
    //   return action.textboxes;
    // case PresentationActions.RECEIVE_TEXTBOX: 
    //   return {...state, [action.textbox.id]: action.textbox};
    default:
      return state;
  }
}

const WrapperReducer = (state = {}, action) => {
  Object.freeze(state);
  
  switch (action.type){
    case PresentationActions.RECEIVE_IMAGE:;
    case PresentationActions.RECEIVE_TEXT:
      return {...state, [action.wrapperData.id]: action.wrapperData};
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
    case PresentationActions.RECEIVE_WRAPPERS: {
      return {...state}
    }
    case PresentationActions.RECEIVE_IMAGE: ;
    case PresentationActions.RECEIVE_TEXT: {
      const wrapper = action.wrapperData;
      const wrapperId = wrapper.id;
      const slideId = wrapper.slideId;
      const slideData = state[slideId];
      const wrapperIds = Array.from(
        new Set([...slideData.wrapperIds, wrapperId])
      );
      return {...state, [slideId]: {...slideData, wrapperIds}};
    } 
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

export default combineReducers({
  docs: DocsReducer,
  slides: SlidesReducer,
  wrappers: WrapperReducer,
  textboxes: TextboxReducer,
  textstyles: TextStyleReducer,
  images: ImagesReducer
});