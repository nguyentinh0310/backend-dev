import { NextFunction, Request, Response } from "express";
import ConversationService from "./conversations.service";

class ConversationControler {
  private conversationService = new ConversationService();

  public getAllCnv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.conversationService.getAllConversation(req.query);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };


  public getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversations = await this.conversationService.getConversations(req.user.id, req.query);
      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  };


  public isReadConv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.conversationService.isReadConv(req.params.id);
      res.status(200).json({ message: "Read conversation" });
    } catch (error) {
      next(error);
    }
  };

  public isUnReadConv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.conversationService.isUnReadConv(req.params.id);
      res.status(200).json({ message: "UnRead conversation" });
    } catch (error) {
      next(error);
    }
  };

  public deleteConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.id;
      await this.conversationService.deleteConversation(fromUserId, toUserId);
      res.status(200).json({ message: "Delete converstion successfully" });
    } catch (error) {
      next(error);
    }
  };
}
export default ConversationControler;
