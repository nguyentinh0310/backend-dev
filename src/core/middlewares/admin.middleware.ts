import { UserSchema } from "@modules/users";
import { NextFunction, Request, Response } from "express";

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = await UserSchema.findOne({ _id: req.user.id }).exec();

    if (user.role !== 1)
      return res.status(400).json({ message: "Admin resources access denied." });

    next();
  } catch (err) {
    next(err);
  }
};

export default authAdmin;
