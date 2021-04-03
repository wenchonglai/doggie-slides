import {connect} from 'react-redux';

import SigninEmailPage from './signin_email_page';
import {fetchAccount} from '../../actions/session_actions'

const mapDTP = (dispatch) => ({
  fetchAccountHandler: (user) => dispatch(fetchAccount(user))
});

export default connect(undefined, mapDTP)(SigninEmailPage);