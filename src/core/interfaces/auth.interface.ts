export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expiredAt: any;
}

export interface TokenActive {
  active_token: string;
}

export interface IDecodedToken {
  id: string;
  fullname?: string;
  account?: string;
  password?: string;
  gender?: string;
  iat: number;
  exp: number;
}
