import { ACTIONS } from "../action-types";

export const loginRequest = (data) => ({
  type: ACTIONS.LOGIN,
  data,
});

export const setLoginData = (data) => ({
  type: ACTIONS.SET_LOGIN_DATA,
  data,
});
export const Forgot_Password = (data) => ({
  type: ACTIONS.FORGOT_PASSWORD,
  data,
});
export const logout = (data) => ({
  type: ACTIONS.LOGOUT,
  data,
});
export const Bording = (data) => ({
  type: ACTIONS.BORDING_SETUP,
  data,
});
export const updateProfile = (data) => ({
  type: ACTIONS.UPDATE_PROFILE,
  data,
});
export const getSingleUser = (data) => ({
  type: ACTIONS.GET_SINGLE_USER,
  data,
});
export const setSingleUser = (data) =>
  // console.log('control in action set', data),
  ({
    type: ACTIONS.SET_SINGLE_USER,
    data,
  });
