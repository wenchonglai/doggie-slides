import {connect} from 'react-redux';
import { withRouter } from 'react-router';

import SigninPasswordPage from './signin_password_page';
import {login} from '../../actions/session_actions';

const mapSTP = (state) => ({
  errors: state.errors.session
});

const mapDTP = (dispatch) => ({
  loginHandler: (user) => dispatch(login(user))
});

export default withRouter(connect(mapSTP, mapDTP)(SigninPasswordPage));