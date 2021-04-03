import * as SessionActions from '../actions/session_actions';

const _nullSession = Object.freeze({user: null});

const sessionReducer = (state = _nullSession, action) => {

  switch (action.type){
    case SessionActions.RECEIVE_CURRENT_USER: 
      return Object.assign({}, action.user);
    case SessionActions.RECEIVE_ACCOUNT:{ 
      return Object.assign({}, action.user);}
    case SessionActions.LOGOUT_CURRENT_USER:
      return _nullSession;
    default:
      return state;
  }
}

export default sessionReducer;