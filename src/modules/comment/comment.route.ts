import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middlewares";
import { Router } from "express";
import CommentController from "./comment.controler";
import CommentDto from "./dtos/comment.dto";

class CommentRoute implements Route {
  public path = "/api/v1/comment";
  public router = Router();
  public commentController = new CommentController();

  constructor(){
    this.initializeRoutes()
  }

  private initializeRoutes(){
    this.router.post(`${this.path}`, validationMiddleware(CommentDto,true), authMiddleware, this.commentController.createComment)
    this.router.put(`${this.path}/:id`, validationMiddleware(CommentDto,true), authMiddleware, this.commentController.updateComment)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.commentController.deleteComment)
    this.router.put(`${this.path}/:id/like`, authMiddleware, this.commentController.likeComment)
    this.router.put(`${this.path}/:id/unlike`, authMiddleware, this.commentController.unlikedComment) 
  }
}

export default CommentRoute;
