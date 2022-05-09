import { IsNotEmpty } from "class-validator";

export default class MessageDto {
  constructor(
    conversation: string,
    sender: string,
    recipient: string,
    text: string,
    media: string[],
    call: string
  ) {
    this.conversation = conversation;
    this.sender = sender;
    this.recipient = recipient;
    this.text = text;
    this.media = media;
    this.call = call;
  }

  @IsNotEmpty()
  public conversation: string;

  @IsNotEmpty()
  public sender: string;

  @IsNotEmpty()
  public recipient: string;
  
  @IsNotEmpty()
  public text: string;

  public media: string[];
  public call: string;
}
