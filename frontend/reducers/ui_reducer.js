import * as UIActions from '../actions/ui_actions';
import * as PresentationActions from '../actions/presentation_actions';
import { combineReducers } from 'redux';

function NextActionReducer(state = 'select', action){
  switch (action.type){
    default: return 'select';
  }
}

const nullState = Object.freeze({wrapperIds: [], nextMenuAction: 'Select'});

function SelectionReducer(state = nullState, action){
  Object.freeze(state);

  switch (action.type){
    case UIActions.RECEIVE_SELECTED_WRAPPERS:
      return action.wrapperIds.length ? {
        ...state,
        wrapperIds: [...action.wrapperIds],
        ...action.sharedAttributes
      } : nullState
    case UIActions.RECEIVE_CURRENT_SLIDE:;
    case UIActions.CLEAR_UI:
      return nullState;
    default: return state;
  }
}


function SlideSettingsReducer(state = {}, action){
  Object.freeze(state);

  switch (action.type){
    case UIActions.RECEIVE_CURRENT_SLIDE:
      return {...state, slideId: action.slideId};
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

const UIReducer = combineReducers({pageSettings: PagesettingsReducer, slideSettings: SlideSettingsReducer, selections: SelectionReducer});

export default UIReducer;