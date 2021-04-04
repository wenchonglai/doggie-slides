import {connect} from 'react-redux';
import { withRouter } from 'react-router';

import SigninEmailPage from './signin_email_page';
import {fetchAccount, login} from '../../actions/session_actions'

const mapSTP = (state) => ({
  errors: state.errors.session
});

const mapDTP = (dispatch) => ({
  fetchAccountHandler: (user) => dispatch(fetchAccount(user)),
  demoLoginHandler: (user) => dispatch(login(user))
});

export default withRouter(connect(mapSTP, mapDTP)(SigninEmailPage));