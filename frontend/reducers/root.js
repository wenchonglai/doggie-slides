import {combineReducers} from 'redux';

import entitiesReducer from './entities_reducer';
import errorsReducer from './errors';
import sessionReducer from './session';
import UIReducer from './ui_reducer'

export default combineReducers({
  entities: entitiesReducer,
  ui: UIReducer,
  errors: errorsReducer,
  session: sessionReducer
});