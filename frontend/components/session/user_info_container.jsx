import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logout } from '../../actions/session_actions';
import UserInfo from './user_info';

const mapSTP = state => ({
  user: state.session
});

const mapDTP = dispatch => ({
  logoutHandler: () => dispatch(logout())
});

const UserInfoContainer = withRouter(connect(mapSTP, mapDTP)(UserInfo));

export default UserInfoContainer;