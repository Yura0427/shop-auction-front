import React from 'react';
import { IUser } from '../../interfaces/user/userData';

interface IUserContext {
  user: IUser | null;
  setGlobalUser: React.Dispatch<any>;
}

export const UserContext = React.createContext<IUserContext>({
  user: null,
  setGlobalUser: () => {},
});
