export interface INotification {
  _id: string;
  id: string,
  recipients: string[];
  url: string;
  text: string;
  content: string;
  image: string;
  isRead: boolean;
}
