import { ActionType, UserActionTypes, IUserCreds } from '../types/user.types';

export const signInUser = (creds: IUserCreds): UserActionTypes => {
  return {
    type: ActionType.USER_SIGN_IN_FETCHING,
    payload: creds,
  };
};

export const signUpUser = (creds: IUserCreds): UserActionTypes => {
  return {
    type: ActionType.USER_SIGN_UP_FETCHING,
    payload: creds,
  };
};

export const signOutUser = (): UserActionTypes => {
  return {
    type: ActionType.USER_SIGN_OUT,
  };
};
