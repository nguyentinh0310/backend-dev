import { NextFunction, Request, Response } from "express";
import MessageService from "./messages.service";

class MessageControler {
  private messageService = new MessageService();
  public addMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const messageData = req.body;
      const userId = req.user.id;
      const message = await this.messageService.addMessage(messageData, userId);
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  };

  public getMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.id;
      const messages = await this.messageService.getMessages(
        fromUserId,
        toUserId,
        req.query
      );
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  };

  public deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const messageId = req.params.id;
      await this.messageService.deleteMessage(userId, messageId);
      res.status(200).json({ message: "Delete Message successfully" });
    } catch (error) {
      next(error);
    }
  };
}
export default MessageControler;
