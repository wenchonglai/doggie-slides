import { connect } from 'react-redux';
import Menu from './menu';

export default connect(
  ({entities, ui}) => ({
    lastAction: ui.selections.lastAction,
    nextMenuAction: ui.selections.nextMenuAction
  }),
  null
)(Menu);