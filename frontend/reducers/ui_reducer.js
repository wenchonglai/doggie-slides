import * as UIActions from '../actions/ui_actions';

export default function UIReducer(state = {}, action){
  Object.freeze(state);

  switch (action.type){
    case UIActions.RECEIVE_CURRENT_SLIDE:
      return {...state, slideId: action.slideId};
    default: return state;
  }
} 