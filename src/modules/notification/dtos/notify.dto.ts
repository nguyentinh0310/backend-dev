import { IsNotEmpty } from "class-validator";

export default class NotificationDto {
  constructor(
    id: string,
    recipients: string[],
    url: string,
    text: string,
    content: string,
    image: string,
    isRead: boolean
  ) {
    this.id = id;
    this.recipients = recipients;
    this.url = url;
    this.text = text;
    this.content = content;
    this.image = image;
    this.isRead = isRead;
  }
  public id: string;
  public recipients: string[];
  public url: string;
  public text: string;
  public content: string;
  public image: string;
  public isRead: boolean;
}
