export interface IUserCreds {
  email: string;
  password: string;
}

export interface IRegister {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface IError {
  statusCode: number;
  message: string;
}

export interface IAvatar {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  url: string;
}

export interface IUser {
  email: string;
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  avatar: IAvatar | null;
  dateOfBirth?: Date | string;
}
export interface IResponseMessage {
  message: string;
}

export interface IUserState {
  user: IUser | null;
  isFetching: boolean;
  isLoggedIn: boolean;
  error: IError | null;
}

export enum ActionType {
  USER_SIGN_IN_FETCHING = 'USER_SIGN_IN_FETCHING',
  USER_SIGN_IN_SUCCESS = 'USER_SIGN_IN_SUCCESS',
  USER_SIGN_IN_ERROR = 'USER_SIGN_IN_ERROR',
  USER_SIGN_UP_FETCHING = 'USER_SIGN_UP_FETCHING',
  USER_SIGN_UP_SUCCESS = 'USER_SIGN_UP_SUCCESS',
  USER_SIGN_UP_ERROR = 'USER_SIGN_UP_ERROR',
  USER_SIGN_OUT = 'USER_SIGN_OUT',
}

export type UserSignInFetchingAction = {
  type: ActionType.USER_SIGN_IN_FETCHING;
  payload: IUserCreds;
};

export type UserSignInSuccessAction = {
  type: ActionType.USER_SIGN_IN_SUCCESS;
  payload: IAuthResponse;
};

export type UserSignInErrorAction = {
  type: ActionType.USER_SIGN_IN_ERROR;
  payload: {};
};

export type UserSignUpFetchingAction = {
  type: ActionType.USER_SIGN_UP_FETCHING;
  payload: IUserCreds;
};

export type UserSignUpSuccessAction = {
  type: ActionType.USER_SIGN_UP_SUCCESS;
  payload: IAuthResponse;
};

export type UserSignUpErrorAction = {
  type: ActionType.USER_SIGN_UP_ERROR;
  payload: {};
};

export type UserSignOut = {
  type: ActionType.USER_SIGN_OUT;
};

export type UserActionTypes =
  | UserSignInFetchingAction
  | UserSignInSuccessAction
  | UserSignInErrorAction
  | UserSignUpFetchingAction
  | UserSignUpSuccessAction
  | UserSignUpErrorAction
  | UserSignOut;
