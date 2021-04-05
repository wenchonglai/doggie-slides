import {connect} from 'react-redux';
import AutosaveInput from './autosave_input';

const mapSTP = (state, {stateHook}) => ({
  stateHook
});

const mapDTP = (dispatch, ownProps) => ({
  saveHandler: (data) => dispatch(ownProps.saveHandler(data))
});

const AutosaveInputContainer = connect(mapSTP, mapDTP)(AutosaveInput);

export default AutosaveInputContainer;