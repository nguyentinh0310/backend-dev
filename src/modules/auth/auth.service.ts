import { HttpException } from "@core/exceptions";
import { IDecodedToken, TokenData } from "@core/interfaces";
import {
  generateAccessToken,
  generateActiveToken,
  generateJwtToken,
  isEmptyObject,
  Logger,
  randomTokenString,
  sendMail,
  validateEmail,
} from "@core/utils";
import { RefreshTokenSchema } from "@modules/refresh_token";
import { IUser, RegisterDto, UserSchema } from "@modules/users";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import LoginDto from "./dtos/auth.dto";

class AuthService {
  public userSchema = UserSchema;
  public CLIENT_URL = `${process.env.BASE_URL}`;

  public async register(model: RegisterDto) {
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

    const createUser = {
      ...model,
      account: formatedAccount,
      password: hashPassword,
    };
    const active_token = generateActiveToken(createUser);

    const url = `${this.CLIENT_URL}/active_account/${active_token}`;

    if (validateEmail(model.account)) {
      sendMail(createUser.account, url, "Verify your email address");
    }
  }

  public async activeAccount(active_token: string) {
    const decoded = <IDecodedToken>jwt.verify(active_token, process.env.ACTIVE_TOKEN_SECRET!);

    const { fullname, account, password, gender } = decoded;

    const user = await this.userSchema.findOne({ account }).exec();
    if (user) {
      throw new HttpException(400, "Account already exists.");
    }
    const newUser = new this.userSchema({
      fullname,
      account,
      password,
      gender,
    });

    return await newUser.save();
  }

  public async login(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }

    const formatedAccount = String(model.account).trim().toLowerCase();
    const user = await this.userSchema.findOne({ account: formatedAccount }).exec();
    if (!user) {
      throw new HttpException(409, `Your email ${model.account} is not exist.`);
    }
    const isMatchPassword = await bcryptjs.compare(model.password, user.password);
    if (!isMatchPassword) throw new HttpException(400, "Password is not match");

    const refreshToken = await this.generateRefreshToken(user._id);

    const jwtToken = generateJwtToken(user._id, refreshToken.token);

    // save refresh token
    // await refreshToken.save();

    return jwtToken;
  }

  public async getCurrentLogginUser(userId: string): Promise<IUser> {
    const user = await this.userSchema
      .findById(userId)
      .select("-password")
      .populate("saved", ["content", "images", "user"])
      .populate("followers followings friends.user friend_requests.user", ["fullname", "avatar"])
      .exec();
    if (!user) {
      throw new HttpException(409, `User is not exist.`);
    }

    return user;
  }

  public async forgotPassword(account: string) {
    const user = await this.userSchema.findOne({ account }).exec();
    if (!user) {
      throw new HttpException(409, `User is not exist.`);
    }

    const access_token = generateAccessToken({ id: user._id });

    const url = `${this.CLIENT_URL}/reset_password/${access_token}`;

    if (validateEmail(account)) {
      sendMail(account, url, "Verify your email address");
      throw new HttpException(200, "Success! Please check your email.");
    }
    return user;
  }

  public async resetPassword(model: LoginDto, userId: string): Promise<any> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(model.password, salt);

    const user = await this.userSchema
      .findOneAndUpdate(
        { _id: userId },
        {
          password: passwordHash,
        }
      )
      .exec();

    return user;
  }

  public async refreshToken(token: string): Promise<TokenData> {
    const refreshToken = await this.getRefreshTokenFromDb(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = await this.generateRefreshToken(user);
    refreshToken.revoked = new Date(Date.now());
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // return basic details and tokens
    return generateJwtToken(user, newRefreshToken.token);
  }

  public async revokeToken(token: string): Promise<void> {
    const refreshToken = await this.getRefreshTokenFromDb(token);

    // revoke token and save
    refreshToken.revoked = new Date(Date.now());
    await refreshToken.save();
  }

  private async getRefreshTokenFromDb(refreshToken: string) {
    const token = await RefreshTokenSchema.findOne({ token: refreshToken }).populate("user").exec();
    Logger.info(token);
    if (!token || !token.isActive) throw new HttpException(400, `Invalid refresh token`);
    return token;
  }

  private async generateRefreshToken(userId: string) {
    // create a refresh token that expires in 7 days
    return new RefreshTokenSchema({
      user: userId,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}

export default AuthService;
