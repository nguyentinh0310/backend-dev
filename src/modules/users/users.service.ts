import { HttpException } from "@core/exceptions";
import { ListResponse } from "@core/interfaces";
import { APIfeatures, isEmptyObject } from "@core/utils";
import { CommentSchema } from "@modules/comment";
import { PostSchema } from "@modules/posts";
import { ProfileSchema } from "@modules/profile";
import bcryptjs from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import RegisterDto from "./dtos/register.dtos";
import { IFriend, IUser } from "./users.interface";
import UserSchema from "./users.model";

class UserService {
  private userSchema = UserSchema;
  private commentSchema = CommentSchema;
  private profileSchema = ProfileSchema;
  private postSchema = PostSchema;

  public client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
  public CLIENT_URL = `${process.env.BASE_URL}`;

  public async createUser(model: RegisterDto) {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const user = await this.userSchema.findOne({ account: model.account }).exec();
    if (user) {
      throw new HttpException(409, `Your email ${model.account} already exist`);
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(model.password!, salt);
    const formatedAccount = String(model.account).trim().toLowerCase();

    const createUser = await this.userSchema.create({
      ...model,
      account: formatedAccount,
      password: hashPassword,
    });
    return createUser;
  }

  public async getAll(query: any): Promise<ListResponse<IUser>> {
    const features = new APIfeatures(
      this.userSchema
        .find()
        .select("-password")
        .populate("followers followings friends.user friend_requests.user", ["fullname", "avatar"]),
      query
    )
      .paginating()
      .sorting();
    const users = await features.query;
    const rowCount = await this.userSchema.countDocuments().exec();

    return {
      data: users,
      totalRows: rowCount,
    };
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await this.userSchema
      .findById(userId)
      .select("-password")
      .populate("followers followings friends.user friend_requests.user", ["fullname", "avatar"])
      .exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }
    return user;
  }

  public async updateUser(userId: string, model: RegisterDto): Promise<IUser> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }
    const { fullname, avatar, gender } = model;

    const user = await this.userSchema
      .findOneAndUpdate(
        { _id: userId },
        {
          fullname,
          avatar,
          gender,
        },
        { new: true }
      )
      .exec();
    if (!user) throw new HttpException(400, "Your id is valid");

    return user;
  }

  public async updateUsersRole(role: string, userId: string): Promise<IUser> {
    const user = await this.userSchema
      .findOneAndUpdate(
        { _id: userId },
        {
          role,
        },
        { new: true }
      )
      .exec();
    if (!user) throw new HttpException(400, "Your id is valid");
    return user;
  }

  public async deleteUser(userId: string): Promise<IUser> {
    const user = await this.userSchema.findByIdAndDelete(userId).exec();
    if (!user) throw new HttpException(400, "Your id is valid");
    await this.profileSchema.findOneAndRemove({ user: userId }).exec();
    await this.commentSchema.findOneAndRemove({ user: userId }).exec();
    await this.postSchema.findOneAndRemove({ user: userId }).exec();

    return user;
  }

  public async deleteManyUsers(userIds: string[]): Promise<number | undefined> {
    const result = await this.userSchema.deleteMany({ _id: [...userIds] }).exec();
    if (!result) throw new HttpException(409, "Your id is invalid");
    return result.deletedCount;
  }

  public async searchUser(keyword: any): Promise<IUser> {
    keyword = new RegExp(keyword, "i");
    const users: any = await this.userSchema
      // .find({ $or: [{ fullname: keyword }, { account: keyword }] })
      .find({ $or: [{ fullname: keyword }] })
      .limit(10)
      .select("fullname account avatar")
      .exec();

    return users;
  }

  public async follow(fromUserId: string, toUserId: string) {
    const user = await this.userSchema.find({
      _id: toUserId,
      followers: fromUserId,
    });
    if (user.length > 0) throw new HttpException(400, "You followed this user.");

    const newFollow = await this.userSchema
      .findByIdAndUpdate(
        { _id: toUserId },
        {
          $push: { followers: fromUserId },
        },
        { new: true }
      )
      .populate("followers followings", "-password")
      .exec();

    await this.userSchema
      .findByIdAndUpdate(
        { _id: fromUserId },
        {
          $push: { followings: toUserId },
        },
        { new: true }
      )
      .populate("followers followings", "-password")
      .exec();

    return newFollow;
  }

  public async unFollow(fromUserId: string, toUserId: string) {
    const newFollow = await this.userSchema
      .findByIdAndUpdate(
        { _id: toUserId },
        {
          $pull: { followers: fromUserId },
        },
        { new: true }
      )
      .select("-password -followers -following -friend_requests -friend")
      .populate("followers followings")
      .exec();

    await this.userSchema
      .findByIdAndUpdate(
        { _id: fromUserId },
        {
          $pull: { followings: toUserId },
        },
        { new: true }
      )
      .select("-password -followers -following -friend_requests -friend")
      .populate("followers followings")
      .exec();

    return newFollow;
  }

  public async addFiend(fromUserId: string, toUserId: string) {
    const fromUser = await this.userSchema.findOne({ _id: fromUserId }).exec();
    if (!fromUser) throw new HttpException(400, "your account is not found");
    const toUser = await this.userSchema.findOne({ _id: toUserId }).exec();
    if (!toUser) throw new HttpException(400, "Target user is not found");

    if (
      fromUser.friend_requests &&
      fromUser.friend_requests.some((friend: IFriend) => friend.toString() === toUserId)
    ) {
      throw new HttpException(400, "You has been already send a friend request to this user");
    }
    if (
      toUser.friends &&
      toUser.friends.some((friend: IFriend) => friend.toString() === fromUserId)
    ) {
      throw new HttpException(400, "Target user has already been friend by from user");
    }

    if (!toUser.friend_requests) toUser.friend_requests = [];
    toUser.friend_requests.unshift({ user: fromUserId } as IFriend);

    await toUser.save();

    return toUser;
  }

  public async unFiend(fromUserId: string, toUserId: string) {
    const fromUser = await this.userSchema.findOne({ _id: fromUserId }).exec();
    if (!fromUser) throw new HttpException(400, "your account is not found");
    const toUser = await this.userSchema.findOne({ _id: toUserId }).exec();
    if (!toUser) throw new HttpException(400, "Target user is not found");

    if (
      fromUser.friends &&
      fromUser.friends.some((friend: IFriend) => friend.toString() === toUserId)
    ) {
      throw new HttpException(400, "You has not been yet friend this user");
    }
    if (
      toUser.friends &&
      toUser.friends.some((friend: IFriend) => friend.toString() === fromUserId)
    ) {
      throw new HttpException(400, "You has not being friend this user");
    }

    if (!fromUser.friends) fromUser.friends = [];
    fromUser.friends = fromUser.friends.filter(({ user }) => user.toString() !== toUserId);
    if (!toUser.friends) toUser.friends = [];
    toUser.friends = toUser.friends.filter(({ user }) => user.toString() !== fromUserId);

    await fromUser.save();
    await toUser.save();

    return fromUser;
  }
  public async acceptFiendRequest(currentUserId: string, requestUserId: string) {
    // check check current user = req.user.id
    const currentUser = await this.userSchema.findOne({ _id: currentUserId }).exec();
    if (!currentUser) throw new HttpException(400, "your account is not found");

    // check check request user = req.params.id
    const requestUser = await this.userSchema.findOne({ _id: requestUserId }).exec();
    if (!requestUser) throw new HttpException(400, "Target user is not found");

    // check exists friend
    if (
      requestUser.friends &&
      requestUser.friends.some((friend: IFriend) => friend.toString() === currentUserId)
    ) {
      throw new HttpException(400, "You has already been friend");
    }

    // check exists friend
    if (
      currentUser.friends &&
      currentUser.friends.some((friend: IFriend) => friend.toString() === requestUserId)
    ) {
      throw new HttpException(400, "You has already been friend");
    }

    // if (
    //   currentUser.friend_requests &&
    //   currentUser.friend_requests.some(
    //     (friend: IFriend) => friend.toString() !== requestUserId
    //   )
    // ) {
    //   throw new HttpException(400, "You has not any friend request related to this user");
    // }

    //  remove friend_requests of currentUser
    if (!currentUser.friend_requests) currentUser.friend_requests = [];
    currentUser.friend_requests = currentUser.friend_requests.filter(
      ({ user }) => user.toString() !== requestUserId
    );

    // add friend to (currentUser) user.req.id
    if (!currentUser.friends) currentUser.friends = [];
    currentUser.friends.unshift({ user: requestUserId } as IFriend);
    // add friend to (requestUser) user.params.id
    if (!requestUser.friends) requestUser.friends = [];
    requestUser.friends.unshift({ user: currentUserId } as IFriend);

    await currentUser.save();
    await requestUser.save();

    return currentUser;
  }

  public async suggestionUser(userId: string, query: any): Promise<ListResponse<IUser>> {
    // const user = await this.userSchema
    //   .findOne({ _id: userId })
    //   .populate("followings followers", "_id")
    //   .select("fullname account avatar")
    //   .exec();

    // const userFollow: any = user?.followings

    // const newArr = [...userFollow, userId];
    // console.log(userFollow);
    const num = query || 10;

    const users = await this.userSchema.aggregate([
      { $match: { _id: { $nin: [userId] } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: { from: "users", localField: "followers", foreignField: "_id", as: "followers" },
      },
      {
        $lookup: { from: "users", localField: "followings", foreignField: "_id", as: "followings" },
      },
      {
        $project: {
          fullname: 1,
          account: 1,
          avatar: 1,
        },
      },
    ]);
    const rowCount = users.length;

    return {
      data: users,
      totalRows: rowCount,
    };
  }
}

export default UserService;
