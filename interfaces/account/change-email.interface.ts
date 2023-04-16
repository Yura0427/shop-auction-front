export interface IChangeEmail {
  token: string;
  userId: number;
  email: string
}

export interface ISendChangeEmail {
  newEmail: string
  userId: number
}
