import { connect } from 'react-redux';

import MenuItem from './menu_item'

const MenuItemContainer = connect(
  state => ({
    state
  }),
  dispatch => ({
    dispatch,
    
  })
)(MenuItem)

export default MenuItemContainer;