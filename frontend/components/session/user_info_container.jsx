import { connect } from 'react-redux';
import { logout } from '../../actions/session_actions';

const mapSTP = state => ({
  user: state.session
});

const mapDTP = dispatch => ({
  logoutHandler: () => dispatch(logout());
});

const UserInfoContainer = connect(mapSTP, null)(UserInfo);