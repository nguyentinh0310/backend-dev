import { Route } from "@core/interfaces";
import { authMiddleware } from "@core/middlewares";
import { Router } from "express";
import ConversationControler from "./conversations.controller";

class ConversationRoute implements Route {
    public path = "/api/v1/conversations";
    public router = Router();
    public conversationControler = new ConversationControler();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      this.router.get(`${this.path}`, authMiddleware, this.conversationControler.getConversations)
      this.router.delete(`${this.path}/:id`, authMiddleware, this.conversationControler.deleteConversations)
    }
  }
  
  export default ConversationRoute;
  