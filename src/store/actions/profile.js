import { PROFILE_START, PROFILE_SUCCESS, PROFILE_FAIL } from "./actionTypes";
import { authAxios } from "../../utils";
import { profileSummaryURL } from "../../constants";

export const profileStart = () => {
  return {
    type: PROFILE_START
  };
};

export const profileSuccess = data => {
  return {
    type: PROFILE_SUCCESS,
    data
  };
};

export const profileFail = error => {
  return {
    type: PROFILE_FAIL,
    error: error
  };
};

export const fetchProfile = () => {
  return dispatch => {
    dispatch(profileStart());
    authAxios
      .get(profileSummaryURL)
      .then(res => {
        dispatch(profileSuccess(res.data));
      })
      .catch(err => {
        dispatch(profileFail(err));
      });
  };
};
