import { IUser } from "@modules/users";

export interface IComment {
  _id: string;
  content: string;
  tag: any;
  reply: string;
  likes: string[];
  user: IUser;
  postId: string;
  postUserId: string;
}
