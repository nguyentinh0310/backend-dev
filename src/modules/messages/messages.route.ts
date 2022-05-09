import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middlewares";
import { Router } from "express";
import MessageDto from "./dtos/message.dto";
import MessageControler from "./messages.controller";

class MessageRoute implements Route {
    public path = "/api/v1/messages";
    public router = Router();
    public messageController = new MessageControler();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
        this.router.post(`${this.path}`, validationMiddleware(MessageDto, true), authMiddleware, this.messageController.addMessage)
        this.router.get(`${this.path}/:id`, authMiddleware, this.messageController.getMessages)
        this.router.delete(`${this.path}/:id`, authMiddleware, this.messageController.deleteMessage)
      }
  }
  
  export default MessageRoute;
  