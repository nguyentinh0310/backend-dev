import { NextFunction, Request, Response } from "express";
import NotificationService from "./notification.service";

class NotificationControler {
  private notificationService = new NotificationService();
  public createNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notiData = req.body;
      const userId = req.user.id;
      const notify = await this.notificationService.createNotify(notiData, userId);
      res.status(200).json(notify);
    } catch (error) {
      next(error);
    }
  };

  public getNotifies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifies = await this.notificationService.getNotifies(req.user.id);
      res.status(200).json(notifies);
    } catch (error) {
      next(error);
    }
  };

  public deleteNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notiId = req.params.id;
      const query_url = req.query.url;
      const notify = await this.notificationService.deleteNotify(notiId, query_url);
      res.status(200).json(notify);
    } catch (error) {
      next(error);
    }
  };

  public isReadNotify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notiId = req.params.id;
      const notify = await this.notificationService.isReadNotify(notiId);
      res.status(200).json(notify);
    } catch (error) {
      next(error);
    }
  };

  public deleteAllNotifies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.notificationService.deleteAllNotifies(req.user.id);
      res.status(200).json({ message: "Delete all notifies" });
    } catch (error) {
      next(error);
    }
  };
}
export default NotificationControler;
