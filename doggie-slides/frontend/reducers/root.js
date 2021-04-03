import {combineReducers} from 'redux';

import entitiesReducer from './entities';
import errorsReducer from './errors';
import sessionReducer from './session';

export default combineReducers({
  entities: entitiesReducer,
  errors: errorsReducer,
  session: sessionReducer
});