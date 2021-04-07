import * as SessionUtil from '../utils/session_util'

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_ACCOUNT = 'RECEIVE_ACCOUNT';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
// export const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';
export const RECEIVE_ERRORS = 'RECEIVE_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export const receiveCurrentUser = (user) => ({
  type: RECEIVE_CURRENT_USER,
  user
});

export const receiveAccount = (user) => ({
  type: RECEIVE_ACCOUNT,
  user
});

export const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER,
});

// export const removeCurrentUser = () => ({
//   type: REMOVE_CURRENT_USER,
//   user
// });

export const receiveErrors = (errors) => ({
  type: RECEIVE_ERRORS,
  errors
});

export const clearErrors = () => ({
  type: CLEAR_ERRORS
});

export const fetchAccount = (formUser) => (dispatch) =>
  SessionUtil.asyncFetchAccount(formUser)
    .then(
      (user) => dispatch(receiveAccount(user)),
      ({responseJSON}) => dispatch(receiveErrors(responseJSON))
    );

export const login = (formUser) => (dispatch) =>
  SessionUtil.asyncLogin(formUser)
    .then(
      (user) => {dispatch(receiveCurrentUser(user))},
      ({responseJSON}) => dispatch(receiveErrors(responseJSON))
    );

export const logout = () => (dispatch) =>
  SessionUtil.asyncLogout()
    .then(
      () => {
        dispatch(logoutCurrentUser());
        dispatch(clearUI())
      },
      ({responseJSON}) => dispatch(receiveErrors(responseJSON))
    );

export const signup = (formUser) => (dispatch) =>
  SessionUtil.asyncSignup(formUser)
    .then(
      (user) => dispatch(receiveCurrentUser(user)),
      ({responseJSON}) => dispatch(receiveErrors(responseJSON))
    );

// export const deleteUser = (currentUserId) => (dispatch) =>
//   SessionUtil.asyncDeleteUser(currentUserId)
//     .then(() => removeCurrentUser(user));

