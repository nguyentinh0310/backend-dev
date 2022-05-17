import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middlewares";
import { Router } from "express";
import NotificationDto from "./dtos/notify.dto";
import NotificationControler from "./notification.controller";

class NotificationRoute implements Route {
  public path = "/api/v1/notification";
  public router = Router();

  public notificationControler = new NotificationControler();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(NotificationDto), authMiddleware, this.notificationControler.createNotify)
    this.router.get(`${this.path}`,  authMiddleware, this.notificationControler.getNotifies)
    this.router.delete(`${this.path}/deleteAllNotify`,  authMiddleware, this.notificationControler.deleteAllNotifies)
    this.router.delete(`${this.path}/:id`,  authMiddleware, this.notificationControler.deleteNotify)
    this.router.put(`${this.path}/isReadNotify/:id`,  authMiddleware, this.notificationControler.isReadNotify)
  }
}

export default NotificationRoute;

