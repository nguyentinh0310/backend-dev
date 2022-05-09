import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
export default class LoginDto {
  constructor(account: string, password: string) {
    this.account = account;
    this.password = password;
  }

  @IsNotEmpty()
  @IsEmail()
  public account: string;

  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
