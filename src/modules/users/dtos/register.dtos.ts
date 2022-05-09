import { IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export default class RegisterDto {
  constructor(
    fullname: string,
    account: string,
    password: string,
    avatar: string,
    gender: string,
    coverImg: string
  ) {
    this.fullname = fullname;
    this.account = account;
    this.password = password;
    this.avatar = avatar;
    this.coverImg = coverImg;
    this.gender = gender;
  }

  @IsNotEmpty()
  @MaxLength(25)
  public fullname: string;

  @IsNotEmpty()
  @IsEmail()
  public account: string;

  @IsNotEmpty()
  @MinLength(6)
  public password: string;

  @IsNotEmpty()
  public avatar: string;

  public coverImg: string;

  @IsNotEmpty()
  public gender: string;
}
