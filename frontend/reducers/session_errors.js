import * as SessionActions from '../actions/session_actions';

const sessionErrorsReducer = (state = [], action) => {
  switch (action.type){
    case SessionActions.RECEIVE_ERRORS: 
      return action.errors;
    case SessionActions.CLEAR_ERRORS: 
      return [];
    default:
      return state;
  }
}

export default sessionErrorsReducer;