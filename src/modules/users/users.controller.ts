import { NextFunction, Request, Response } from "express";
import RegisterDto from "./dtos/register.dtos";
import UserService from "./users.service";

export default class UsersController {
  private userService = new UserService();
public createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const model: RegisterDto = req.body;
    const user = await this.userService.createUser(model);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getAll(req.query);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      const user = await this.userService.updateUser(req.user.id, model);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateUsersRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.body;
      const result = await this.userService.updateUsersRole(role, req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await this.userService.deleteUser(req.params.id);
    res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    next(error);
  }
};

  public deleteManyUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ids: string[] = req.body;
      const result = await this.userService.deleteManyUsers(ids);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const keyword = req.query.keyword;
      if (keyword) {
        const result = await this.userService.searchUser(keyword);
        res.status(200).json(result);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      next(error);
    }
  };

  public follow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.id;
      const result = await this.userService.follow(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public unFollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.id;
      const result = await this.userService.unFollow(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addFiend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.id;
      const result = await this.userService.addFiend(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public unFiend = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.id;
      const result = await this.userService.unFiend(fromUserId, toUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public acceptFiendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = req.user.id;
      const requestUserId = req.params.id;
      const result = await this.userService.acceptFiendRequest(currentUserId, requestUserId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public suggestionUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const num = req.query.num;
      const result = await this.userService.suggestionUser(userId, num);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
