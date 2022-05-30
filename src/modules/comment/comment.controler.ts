import { NextFunction, Request, Response } from "express";
import CommentService from "./comment.service";
import CommentDto from "./dtos/comment.dto";

class CommentController {
  public commentService = new CommentService();

  public getAllComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await this.commentService.getAllComment(req.query);
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  };

  public createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const commentData: CommentDto = req.body;
      const userId = req.user.id;
      const newComment = await this.commentService.createComment(
        userId,
        commentData
      );

      res.status(201).json(newComment);
    } catch (error) {
      next(error);
    }
  };

  public updateComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const commentData: CommentDto = req.body;
      const userId = req.user.id;
      const commenId = req.params.id;
      const comment = await this.commentService.updateComment(
        userId,
        commenId,
        commentData
      );

      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const commenId = req.params.id;
      await this.commentService.deleteComment(userId, commenId);
      res.status(200).json({ message: "Delete Comment!" });
    } catch (error) {
      next(error);
    }
  };

  public likeComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const commentId = req.params.id;
      await this.commentService.likeComment(userId, commentId);
      res.status(200).json({ message: "Like post" });
    } catch (error) {
      next(error);
    }
  };

  public unlikedComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const commentId = req.params.id;
      await this.commentService.unLikedComment(userId, commentId);
      res.status(200).json({ message: "Unliked post" });
    } catch (error) {
      next(error);
    }
  };
}

export default CommentController;
