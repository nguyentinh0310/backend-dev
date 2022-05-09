import { IsNotEmpty } from "class-validator";

export default class ConversationDto {
  constructor(
    recipients: string[],
    text: string,
    media: string[],
    call: string
  ) {
    this.recipients = recipients;
    this.text = text;
    this.media = media;
    this.call = call;
  }

  @IsNotEmpty()
  public recipients: string[];

  @IsNotEmpty()
  public text: string;

  public media: string[];
  public call: string;
}
