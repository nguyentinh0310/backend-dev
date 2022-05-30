import { HttpException } from "@core/exceptions";
import { ListResponse } from "@core/interfaces";
import { APIfeatures } from "@core/utils";
import { CommentSchema } from "@modules/comment";
import { IUser, UserSchema } from "@modules/users";
import CreatePostDto from "./dtos/create-posts.dto";
import { IPost } from "./posts.interface";
import PostSchema from "./posts.model";

class PostService {
  private postSchema = PostSchema;
  private userSchema = UserSchema;
  private commentSchema = CommentSchema;

  public async createPost(userId: string, postDto: CreatePostDto): Promise<IPost> {
    const { content, images } = postDto;

    const newPost = await this.postSchema.create({
      content,
      images,
      user: userId,
    });

    return newPost;
  }
  public async getAllPosts(query: any): Promise<ListResponse<IPost>> {
    const features = new APIfeatures(
      this.postSchema
        .find()
        .populate("user likes", ["fullname", "avatar", "followings", "followers"])
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "fullname avatar account",
          },
        }),
      query
    )
      .paginating()
      .sorting();
    const posts = await features.query;
    const rowCount = await this.postSchema.countDocuments().exec();

    return {
      data: posts,
      totalRows: rowCount,
    };
  }

  public async getFollowPosts(query: any, userId: string): Promise<ListResponse<IPost>> {
    const user = await this.userSchema
      .findOne({ _id: userId })
      .populate("followings", "_id")
      .exec();
    const userFollow: any = user?.followings;

    const features = new APIfeatures(
      this.postSchema
        .find({
          user: [...userFollow, userId],
        })
        .populate("user likes", ["fullname", "avatar", "followings", "followers"])
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "fullname avatar account",
          },
        }),
      query
    )
      .paginating()
      .sorting();
    const posts = await features.query;
    const rowCount = posts.length;

    return {
      data: posts,
      totalRows: rowCount,
    };
  }

  public async getPostById(postId: string): Promise<IPost> {
    const post = await this.postSchema
      .findById(postId)
      .populate("user likes", ["fullname", "avatar", "followings", "followers"])

      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      })
      .exec();
    if (!post) throw new HttpException(400, "Post is not found.");
    return post;
  }

  public async getUserPosts(userId: string, query: any): Promise<ListResponse<IPost>> {
    const features = new APIfeatures(
      this.postSchema
        .find({ user: userId })
        .populate("user likes", ["fullname", "avatar", "followings", "followers"])
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "fullname avatar account",
          },
        }),
      query
    )
      .paginating()
      .sorting();

    const posts = await features.query;
    const rowCount = posts.length;

    return {
      data: posts,
      totalRows: rowCount,
    };
  }

  public async updatePost(postId: string, postDto: CreatePostDto): Promise<IPost> {
    const post = await this.postSchema
      .findByIdAndUpdate(
        postId,
        {
          ...postDto,
        },
        { new: true }
      )
      .populate("user", ["fullname", "avatar"])
      .exec();
    if (!post) throw new HttpException(400, "Post is not found");

    return post;
  }

  public async deletePost(userId: string, postId: string): Promise<IPost> {
    const post = await this.postSchema.findById(postId).exec();
    if (!post) throw new HttpException(400, "Post not found");

    if (post.user.toString() !== userId) throw new HttpException(400, "User is not authorized");

    await post.remove();
    await this.commentSchema.deleteMany({ _id: { $in: post.comments } });
    await this.userSchema
      .findOneAndUpdate(
        { _id: userId },
        {
          $pull: { saved: postId },
        },
        { new: true }
      )
      .exec();
    return post;
  }
  public async deleteManyPosts(postIds: string[]): Promise<number | undefined> {
    const result = await this.postSchema.deleteMany({ _id: [...postIds] }).exec();
    if (!result) throw new HttpException(40, "PostId is invalid");
    return result.deletedCount;
  }


  public async likePost(userId: string, postId: string): Promise<IPost> {
    const post = await this.postSchema
      .find({
        _id: postId,
        likes: userId,
      })
      .populate("user likes", ["fullname", "avatar", "followings", "followers"])
      .exec();

    if (post.length > 0) throw new HttpException(400, "You liked this post.");

    const like = await this.postSchema
      .findOneAndUpdate(
        { _id: postId },
        {
          $push: { likes: userId },
        },
        { new: true }
      )
      .populate("user likes", ["fullname", "avatar", "followings", "followers"])
      .exec();
    if (!like) throw new HttpException(400, "This post does not exist.");

    return like;
  }

  public async unLikePost(userId: string, postId: string): Promise<IPost> {
    const unlike = await this.postSchema
      .findOneAndUpdate(
        { _id: postId },
        {
          $pull: { likes: userId },
        },
        { new: true }
      )
      .populate("user likes", ["fullname", "avatar", "followings", "followers"])
      .exec();
    if (!unlike) throw new HttpException(400, "This post does not exist.");

    return unlike;
  }

  public async savePost(userId: string, postId: string): Promise<IUser> {
    const user = await this.userSchema
      .find({
        _id: userId,
        saved: postId,
      })
      .exec();
    if (user.length > 0) throw new HttpException(400, "You saved this post.");

    const save = await this.userSchema
      .findOneAndUpdate(
        { _id: userId },
        {
          $push: { saved: postId },
        },
        { new: true }
      )
      .exec();

    if (!save) throw new HttpException(400, "This user does not exist.");
    return save;
  }

  public async unSavePost(userId: string, postId: string): Promise<IUser> {
    const save = await this.userSchema
      .findOneAndUpdate(
        { _id: userId },
        {
          $pull: { saved: postId },
        },
        { new: true }
      )
      .exec();

    if (!save) throw new HttpException(400, "This user does not exist.");
    return save;
  }
}

export default PostService;
