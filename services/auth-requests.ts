import { IFastRegister, IRegister, IUserCreds } from '../interfaces/user/userData';
import { api } from 'api';

export const login = ({ email, password }: IUserCreds) => {
  return api.user.login(email, password);
};

export const getUser = async () => {
  if (localStorage.hasOwnProperty('TOKEN')) {
    return api.user.getUser();
  }
  const error = new Error();
  throw error;
};

export const register = (data: IRegister) => {
  return api.user.register(data);
};

export const registerCutUser = (data: IFastRegister) => {
  return api.user.registerCutUser(data);
};

export const verifyAccount = (codeQuery: string | string[], userId: number) => {
  return api.user.verifyAccount({ token: codeQuery as string, userId: +userId });
};
