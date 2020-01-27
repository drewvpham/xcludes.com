import {
  PROFILE_START,
  PROFILE_SUCCESS,
  PROFILE_FAIL
} from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  userProfile: null,
  error: null,
  profile_loading: false
};

const profileStart = (state, action) => {
  return updateObject(state, {
    error: null,
    profile_loading: true
  });
};

const profileSuccess = (state, action) => {
  return updateObject(state, {
    userProfile: action.data,
    error: null,
    profile_loading: false
  });
};

const profileFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    profile_loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_START:
      return profileStart(state, action);
    case PROFILE_SUCCESS:
      return profileSuccess(state, action);
    case PROFILE_FAIL:
      return profileFail(state, action);
    default:
      return state;
  }
};

export default reducer;
