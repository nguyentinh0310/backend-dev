import { IUser } from "@modules/users";

export interface IPost {
  _id: string;
  content: string;
  images: string[];
  likes: string[];
  comments: string[];
  user: IUser;
}
