import * as SessionActions from '../actions/session_actions';

const entitiesReducer = (state = {}, action) => {
  Object.freeze(state);
  
  switch (action.type){
    case SessionActions.RECEIVE_CURRENT_USER: 
      return state;
    default:
      return state;
  }
}

export default entitiesReducer;