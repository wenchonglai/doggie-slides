import * as UIActions from '../actions/ui_actions';

export default function UIReducer(state = {}, action){
  Object.freeze(state);

  switch (action.type){
    case UIActions.RECEIVE_CURRENT_SLIDE:
      return {...state, slideId: action.slideId};
    case UIActions.RECEIVE_PAGE_SETTINGS: {
      return {...state, ...action.pageSettings}
    };
    case UIActions.CLEAR_UI:
      return {};
    default: return state;
  }
} 