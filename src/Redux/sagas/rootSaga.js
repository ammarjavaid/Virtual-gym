import {fork, all} from 'redux-saga/effects';
import {
  forgotSaga,
  GetUserSaga,
  loginSaga,
} from './AuthSaga';

export function* rootSaga() {
  yield all([
    loginSaga(),
    forgotSaga(),
    GetUserSaga(),
  ]);
}
