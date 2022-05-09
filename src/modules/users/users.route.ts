import { Route } from "@core/interfaces";
import { authAdmin, authMiddleware, validationMiddleware } from "@core/middlewares";
import { Router } from "express";
import RegisterDto from "./dtos/register.dtos";
import UserControler from "./users.controller";

export default class UsersRoute implements Route {
  public path = "/api/v1/users";
  public router = Router();

  public userController = new UserControler();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, validationMiddleware(RegisterDto, true), this.userController.createUser);
    this.router.get(`${this.path}/search`, authMiddleware, this.userController.searchUsers);
    this.router.get(`${this.path}/suggest_user`, authMiddleware, this.userController.suggestionUser);
    this.router.get(this.path, authMiddleware, authAdmin, this.userController.getAll);
    this.router.get(`${this.path}/:id`, authMiddleware, this.userController.getUserById);
    
    this.router.put(this.path, validationMiddleware(RegisterDto, true), authMiddleware, this.userController.updateUser);
    this.router.put(`${this.path}/update_role/:id`, authMiddleware, authAdmin, this.userController.updateUsersRole);
    this.router.delete(`${this.path}/:id`, authMiddleware, authAdmin, this.userController.deleteUser);
    this.router.delete(this.path, authMiddleware, authAdmin, this.userController.deleteManyUsers);

    this.router.put(`${this.path}/follow/:id`, authMiddleware, this.userController.follow);
    this.router.put(`${this.path}/unfollow/:id`, authMiddleware, this.userController.unFollow);

    this.router.post(`${this.path}/friend/:id`, authMiddleware, this.userController.addFiend);
    this.router.delete(`${this.path}/friend/:id`, authMiddleware, this.userController.unFiend);
    this.router.put(`${this.path}/friend/:id`, authMiddleware, this.userController.acceptFiendRequest);


  }
}
