import { ApiCall } from "../../Services/Apis";
import { ACTIONS } from "../action-types";
import { put, takeLatest } from "redux-saga/effects";
import { setLoginData, setSingleUser } from "../actions/AuthActions";
import { setLoader } from "../actions/GernalActions";
import { message } from "antd";

function* loginRequest(params) {
  try {
    const res = yield ApiCall({
      params: params.data,
      route: "auth/login",
      verb: "post",
    });

    if (res?.status == "200") {
      yield put(setLoginData(res?.response));
      yield put(setLoader(false));
    } else {
      console.log("error", res.response);
      yield put(setLoader(false));

      message.error(res?.response?.message);
    }
  } catch (e) {
    console.log("saga login error -- ", e.toString());
  }
}
export function* loginSaga() {
  yield takeLatest(ACTIONS.LOGIN, loginRequest);
}

function* forgotRequest(params) {
  try {
    const res = yield ApiCall({
      params: params.data.params,
      route: "auth/forgot-password",
      verb: "patch",
    });

    if (res?.status == "200") {
      params.data.setShow(true);
      message.success(res?.response?.message);
      yield put(setLoader(false));
    } else {
      console.log("error", res.response);
      yield put(setLoader(false));

      message.error(res?.response?.message);
    }
  } catch (e) {
    console.log("saga Forgot password error -- ", e.toString());
  }
}
export function* forgotSaga() {
  yield takeLatest(ACTIONS.FORGOT_PASSWORD, forgotRequest);
}

function* GetUserRequest(params) {
  try {
    const res = yield ApiCall({
      token: params.data,
      route: "admin/admin_detail",
      verb: "get",
    });

    if (res?.status == "200") {
      // console.log(res?.response);
      yield put(setSingleUser(res?.response?.admin));
    } else {
      console.log("error", res?.response);
      message.error(res?.response?.message);
    }
  } catch (e) {
    console.log("saga get single user profile err --- ", e);
  }
}
export function* GetUserSaga() {
  yield takeLatest(ACTIONS.GET_SINGLE_USER, GetUserRequest);
}
