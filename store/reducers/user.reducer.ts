import { ActionType, UserActionTypes, IUserState } from '../types/user.types';
import { setToken, removeToken, removeUser, setUser } from 'services/local-storage-controller';

export const initialState: IUserState = {
  user: null,
  isFetching: false,
  isLoggedIn: false,
  error: null,
};

export const userReducer = (state = initialState, action: UserActionTypes): IUserState => {
  switch (action.type) {
    case ActionType.USER_SIGN_IN_FETCHING:
    case ActionType.USER_SIGN_UP_FETCHING:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ActionType.USER_SIGN_IN_SUCCESS:
    case ActionType.USER_SIGN_UP_SUCCESS:
      //@ts-ignore
      setUser(action.payload);
      setToken(action.payload.token);
      return {
        ...state,
        isFetching: false,
        user: action.payload.user,
        isLoggedIn: true,
      };
    case ActionType.USER_SIGN_IN_ERROR:
    case ActionType.USER_SIGN_UP_ERROR:
      return {
        ...state,
        isFetching: false,
        error: null,
      };
    case ActionType.USER_SIGN_OUT:
      removeUser();
      removeToken();
      return {
        ...state,
        user: null,
        isLoggedIn: false,
      };
    default:
      return state;
  }
};
