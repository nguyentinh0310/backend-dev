import { NextFunction, Request, Response } from "express";
import CreatePostDto from "./dtos/create-posts.dto";
import PostService from "./posts.service";

class PostController {
  private postService = new PostService();
  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const postData: CreatePostDto = req.body;
      const newPost = await this.postService.createPost(userId, postData);
      res.status(200).json(newPost);
    } catch (error) {
      next(error);
    }
  };

  public getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await this.postService.getAllPosts(req.query);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  public getFollowPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const posts = await this.postService.getFollowPosts(req.query, userId);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getPostById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const post = await this.postService.getUserPosts(userId, req.query);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const postData = req.body;
      const post = await this.postService.updatePost(postId, postData);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const post = await this.postService.deletePost(userId, postId);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const postLike = await this.postService.likePost(userId, postId);
      res.status(200).json(postLike);
    } catch (error) {
      next(error);
    }
  };

  public unLikePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const postUnLike = await this.postService.unLikePost(userId, postId);
      res.status(200).json(postUnLike);
    } catch (error) {
      next(error);
    }
  };

  public savePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const savedPost = await this.postService.savePost(userId, postId);
      res.status(200).json(savedPost);
    } catch (error) {
      next(error);
    }
  };

  public unSavePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const postId = req.params.id;
      const post = await this.postService.unSavePost(userId, postId);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };
}
export default PostController;
