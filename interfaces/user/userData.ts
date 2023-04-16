import { IGetDelivery } from '../delivery/delivery';

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

export interface IFastRegister {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  isExistingUser?: boolean;
  message: string;
}
export interface IUserResponse {
  data: IUser;
}

export interface IAvatar {
  name: string;
}

export interface IUser {
  email: string;
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  dateOfBirth: Date | null;
  avatar: IAvatar | null;
  googleId?: string;
  facebookId?: string;
  hasPassword?: boolean;
  notcall?: boolean;
  wafCoins?: number;
  winnerDate?: Date;
  userWallet?: string;
  deliveryMethod: string;
  comment: string;
  courierDeliveryAddress: string;
}

export interface IUserProfile {
  email: string;
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  dateOfBirth: Date | null;
  avatar: IAvatar | null;
  googleId?: string;
  facebookId?: string;
  hasPassword?: boolean;
  delivery: IGetDelivery;
  wafCoins?: number;
  winnerDate?: Date;
}

export interface IGoogleUser {
  googleId: string;
  email: string;
  givenName: string;
  familyName: string;
}

export interface IFbUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface IResponseMessage {
  success?: boolean;
  message: string;
}

export interface IFeedbackUser {
  email: string;
  name: string;
  text: string;
}

export interface IResetPassword {
  userId: number;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IPreResetPassword {
  userId: number;
  token: string;
}
