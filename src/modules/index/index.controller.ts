import { NextFunction, Request, Response } from "express";

export default class IndexControler {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ message: "Hello world. API is running..." });
    } catch (error) {
      next(error);
    }
  };
}
