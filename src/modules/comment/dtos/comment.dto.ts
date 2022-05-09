import { IsNotEmpty } from "class-validator";

export default class CommentDto {
  constructor(content: string, tag: string, reply: string, postId: string, postUserId: string) {
    this.content = content;
    this.tag = tag;
    this.reply = reply;
    this.postId = postId;
    this.postUserId = postUserId;
  }

  @IsNotEmpty()
  public content: string;

  @IsNotEmpty()
  public postId: string;

  public tag: string;
  public reply: string;
  public postUserId: string;
}
