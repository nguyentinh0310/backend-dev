import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middlewares";
import { Router } from "express";
import CreatePostDto from "./dtos/create-posts.dto";
import PostController from "./posts.controler";

class PostRoute implements Route {
  public path = "/api/v1/posts";
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreatePostDto, true),
      authMiddleware,
      this.postController.createPost
    );
    this.router.get(`${this.path}`, this.postController.getAllPosts);
    this.router.get(`${this.path}/follow`, authMiddleware , this.postController.getFollowPosts);
    this.router.get(`${this.path}/:id`, this.postController.getPostById);
    this.router.get(`${this.path}/user-posts/:id`, this.postController.getUserPosts);
    this.router.put(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), authMiddleware, this.postController.updatePost
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.postController.deletePost);
    this.router.put(`${this.path}/:id/like`, authMiddleware, this.postController.likePost);
    this.router.put(`${this.path}/:id/unlike`, authMiddleware, this.postController.unLikePost);
    this.router.put(`${this.path}/save-post/:id`, authMiddleware, this.postController.savePost);
    this.router.put(`${this.path}/unsaved-post/:id`, authMiddleware, this.postController.unSavePost
    );
  }
}

export default PostRoute;
