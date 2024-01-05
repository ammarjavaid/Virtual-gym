import {combineReducers} from 'redux';
import authReducer from './AuthReducers';
import GernelReducers from './GernelReducers';

export const rootReducer = combineReducers({
  auth: authReducer,
  gernal: GernelReducers,
});
