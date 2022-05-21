import { TokenData } from "@core/interfaces";
import jwt from "jsonwebtoken";
import crypto from 'crypto';


export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const generateActiveToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, { expiresIn: "5m" });
};

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: '2d'})
}
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {expiresIn: '7d'})
}

export const generateJwtToken = (userId: string, refresh_token: string): TokenData => {
  const dataInToken: any = { id: userId };
  const secret: string = process.env.ACCESS_TOKEN_SECRET ?? '';
  const expiresIn = "2d";
  return {
    access_token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    refresh_token: refresh_token,
    expiredAt: expiresIn
  };
};

export const randomTokenString = (): string => {
  return crypto.randomBytes(40).toString('hex');
};
