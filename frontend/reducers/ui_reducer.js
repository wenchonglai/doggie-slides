import * as UIActions from '../actions/ui_actions';
import * as PresentationActions from '../actions/presentation_actions';
import { combineReducers } from 'redux';

const nullState = Object.freeze({
  wrapperIds: [], nextMenuAction: 'Select', editMode: false
});

function SelectionReducer(state = nullState, action){
  Object.freeze(state);

  if (action.type === UIActions.RECEIVE_MENU_ACTION)
    return {...nullState, nextMenuAction: action.nextMenuAction};

  const newState = {...state, nextMenuAction: 'Select'};

  switch (action.type){
    case UIActions.RECEIVE_SELECTED_TEXT: 
      return {
        ...newState,
        selectOffset: action.selectOffset,
        cursorOffset: action.cursorOffset
      };
      case PresentationActions.RECEIVE_TEXT: {
        return {
          ...newState,
          // wrapperIds: [action.wrapperData.id]
        }
      };
    case PresentationActions.RECEIVE_WRAPPERS: {
      return {
        ...newState,
        wrapperIds: state.wrapperIds.filter(id => action.wrappers[id])
      }
    };
    case UIActions.RECEIVE_SELECTED_WRAPPERS: 
      return action.wrapperIds.length ? {
        ...newState,
        wrapperIds: [...action.wrapperIds],
        ...action.sharedAttributes
      } : {...nullState, nextMenuAction: state.nextMenuAction}
    case PresentationActions.RECEIVE_WRAPPER: {
      if (!action.wrapper) return nullState;
      else return newState;
    };
    case UIActions.RECEIVE_EDIT_MODE: {
      return {...newState, editMode: action.value}
    };
    case PresentationActions.RECEIVE_SLIDE:;
    case UIActions.RECEIVE_CURRENT_SLIDE:;
    case UIActions.CLEAR_UI:
      return nullState;
    default: return newState;
  }
}

function SlideSettingsReducer(state = {}, action){
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_SLIDES: {
      let slideId = Math.max(...Object.keys(action.slides));

      for (let key of Object.keys(action.slides))
        if (state.slideId === key){
          slideId = key;
          break;
        } 

      return {...state, slideId}
    }
    case UIActions.RECEIVE_CURRENT_SLIDE:
      return {...state, slideId: action.slideId};
    case UIActions.RECEIVE_ZOOM_LEVEL:
      return {...state, zoom: action.zoom};
    case UIActions.RECEIVE_PRESENTING_SLIDE: {
      let {slideId} = action;
      if (slideId !== undefined)
        return {...state, slideId, isFullScreen: true};
      else
        return {...state, isFullScreen: false};
    };
    case UIActions.CLEAR_UI:
      return {};
    default: return state;
  }
}

function PagesettingsReducer(state = {}, action){
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_ENTITIES: {
      const doc = Object.values(action.entities.docs)[0];

      return doc ?
        {...state, docId: doc.id, pageWidth: doc.width, pageHeight: doc.height} :
        {};
    }
    case UIActions.RECEIVE_PAGE_SETTINGS: {
      return {...state, ...action.pageSettings}
    };
    case UIActions.CLEAR_UI:
      return {};
    default: return state;
  }
}

const UIReducer = combineReducers({
  pageSettings: PagesettingsReducer,
  slideSettings: SlideSettingsReducer,
  selections: SelectionReducer
});

export default UIReducer;