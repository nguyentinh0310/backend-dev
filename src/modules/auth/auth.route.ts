import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middlewares";
import { RegisterDto } from "@modules/users";
import { Router } from "express";
import AuthControler from "./auth.controller";

export default class AuthRoute implements Route {
  public path = "/api/v1/auth";
  public router = Router();

  public authController = new AuthControler();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path +'/register', validationMiddleware(RegisterDto, true), this.authController.register);
    this.router.post(this.path + "/active", this.authController.activeAccount);
    this.router.post(this.path + "/login", this.authController.login);
    this.router.post(this.path + "/logout", this.authController.logout);
    this.router.post(this.path + '/refresh-token', this.authController.refreshToken);
    this.router.post(this.path + '/revoke-token', this.authController.revokeToken);
    this.router.post(this.path + '/forgot-password', this.authController.forgotPassword);
    this.router.post(this.path + '/reset-password',  authMiddleware, this.authController.resetPassword);
    this.router.post(this.path + '/update-password',  authMiddleware, this.authController.updatePassword);
    this.router.get(this.path, authMiddleware, this.authController.getCurrentLogginUser);
  }
}
