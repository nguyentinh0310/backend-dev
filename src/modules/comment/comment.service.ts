import { HttpException } from "@core/exceptions";
import { PostSchema } from "@modules/posts";
import { IComment } from "./comment.interface";
import CommentSchema from "./comment.model";
import CommentDto from "./dtos/comment.dto";

class CommentService {
  private commentSchema = CommentSchema;
  private postSchema = PostSchema;

  public async createComment(userId: string, commentDto: CommentDto): Promise<IComment> {
    const { content, postId, postUserId, reply, tag } = commentDto;

    const post = await this.postSchema.findById(postId);
    if (!post) throw new HttpException(400, "Post is not found");

    if (reply) {
      const comment = await this.commentSchema.findById(reply);
      if (!comment) throw new HttpException(400, "This comment is not exit");
    }

    const newComment: any = new this.commentSchema({
      user: userId,
      content,
      postId,
      reply,
      tag,
      postUserId,
    });

    await this.postSchema
      .findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      )
      .exec();

    const saveComment = await newComment.save();
    await post.save();

    return saveComment;
  }

  public async updateComment(
    userId: string,
    commentId: string,
    commentDto: CommentDto
  ): Promise<IComment> {
    const { content } = commentDto;
    const comment = await this.commentSchema.findOneAndUpdate(
      {
        _id: commentId,
        user: userId,
      },
      { content },
      { new: true }
    );

    if (!comment) throw new HttpException(400, "Comment not found");

    return comment;
  }

  public async deleteComment(userId: string, commentId: string) {
    const comment: any = await this.commentSchema.findById(commentId).exec();

    await comment.remove();

    if (!comment) throw new HttpException(400, "This comment is not exit");

    await this.postSchema
      .findOneAndUpdate(
        { _id: comment?.postId },
        {
          $pull: { comments: commentId },
        },
        { new: true }
      )
      .exec();
  }

  public async likeComment(userId: string, commenId: string) {
    const comment = await this.commentSchema
      .find({
        _id: commenId,
        likes: userId,
      })
      .exec();
    if (comment.length > 0) throw new HttpException(400, "You liked this comment.");

    const like = await this.commentSchema
      .findOneAndUpdate(
        { _id: commenId },
        {
          $push: { likes: userId },
        },
        { new: true }
      )
      .exec();

    if (!like) throw new HttpException(400, "This comment does not exist.");
  }

  public async unLikedComment(userId: string, commenId: string) {
    const unlike = await this.commentSchema
      .findOneAndUpdate(
        { _id: commenId },
        {
          $pull: { likes: userId },
        },
        { new: true }
      )
      .exec();
    if (!unlike) throw new HttpException(400, "This comment does not exist.");
  }
}

export default CommentService;
