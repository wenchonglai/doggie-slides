import {connect} from 'react-redux';
import { withRouter } from 'react-router';

import {signup} from '../../actions/session_actions'
import SignupPage from './signup_page';

const mapSTP = (state) => ({
  errors: state.errors.session
});

const mapDTP = (dispatch) => ({
  signupHandler: (user) => dispatch(signup(user)),
});

const SignupContainer = withRouter(connect(mapSTP, mapDTP)(SignupPage));

export default SignupContainer;