import { IDecodedToken } from "@core/interfaces";
import { Logger } from "@core/utils";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const token =
    cookies && cookies.jwt ? cookies.jwt : req.header("Authorization");
  // console.log("cookies: ", cookies);

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied." });
  try {
    const user = <IDecodedToken>(
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET ?? "")
    );
    if (!req.user) req.user = { id: "" };

    req.user.id = user.id;
    next();
  } catch (error: any) {
    Logger.error(`[ERROR] Msg: ${token}`);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token is expired" });
    } else {
      res.status(401).json({ message: "Token is not valid" });
    }
  }
};
export default authMiddleware;
