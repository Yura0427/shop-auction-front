export interface IAuth {
  returnToTabHandler: () => void;
  toggle?: () => void;
}

export interface IRegister {
  toggle?: () => void;
  toggleConfirmed?: () => void;
  returnToTabHandler: () => void;
}

export interface IPopoverState {
  message: string;
  statusCode?: number;
}

export interface googleResponse {
  clientId: string;
  credential: string;
  select_by: string;
}

export interface decodeDataI {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}
