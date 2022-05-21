import { TokenData } from "@core/interfaces";
import { validateEmail } from "@core/utils";
import { RegisterDto } from "@modules/users";
import { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service";
import LoginDto from "./dtos/auth.dto";

export default class UsersController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      await this.authService.register(model);
      if (validateEmail(model.account)) {
        res.status(200).json({ message: "Success! Please check your email." });
      }
    } catch (error) {
      next(error);
    }
  };

  public activeAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { active_token } = req.body;
      await this.authService.activeAccount(active_token);
      res.json({ message: "Account has been activated!" });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;
      const tokenData: TokenData = await this.authService.login(model);

      res.cookie("jwt", tokenData.access_token, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000, // 1h
      });

      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("jwt");
      res.status(200).json({ message: "Logout successfully!" });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentLogginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.getCurrentLogginUser(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { account } = req.body;
      const user = await this.authService.forgotPassword(account);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;
      const userId = req.user.id;

      await this.authService.resetPassword(model, userId);
      res.status(200).json({ message: "Password successfully changed!" });
    } catch (error) {
      next(error);
    }
  };
  public updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password_old, password } = req.body;
      const userId = req.user.id;

      await this.authService.updatePassword(password_old, password, userId);
      res.status(200).json({ message: "Password successfully changed!" });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.body.refresh_token;
      const tokenData = await this.authService.refreshToken(refresh_token);

      res.cookie("jwt", tokenData.access_token, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000, // 1h
      });

      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public revokeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.body.token;
      await this.authService.revokeToken(token);
      res.status(200);
    } catch (error) {
      next(error);
    }
  };
}
