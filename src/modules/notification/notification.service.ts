import { HttpException } from "@core/exceptions";
import { isEmptyObject } from "@core/utils";
import NotificationDto from "./dtos/notify.dto";
import { INotification } from "./notification.interface";
import NotificationSchema from "./notification.model";

class NotificationService {
  private notificationSchema = NotificationSchema;
  public async createNotify(model: NotificationDto, userId: string): Promise<INotification> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }
    const { id, recipients, url, text, content, image } = model;
    const notify = new this.notificationSchema({
      id,
      recipients,
      url,
      text,
      content,
      image,
      user: userId,
    });

    await notify.save();

    return notify;
  }

  public async getNotifies(userId: string): Promise<INotification[]> {
    const notifies = await this.notificationSchema
      .find({ recipients: userId })
      .sort("-createdAt")
      .populate("user", "avatar fullname");
    return notifies;
  }

  public async deleteNotify(notiId: string, query_url: any): Promise<INotification> {
    const notify = await this.notificationSchema.findOneAndDelete({
      id: notiId,
      url: query_url,
    });
    if (!notify) throw new HttpException(400, "Nofity is not found");
    return notify;
  }

  public async isReadNotify(notiId: string): Promise<INotification> {
    const notify: any = await this.notificationSchema.findOneAndUpdate(
      { _id: notiId },
      {
        isRead: true,
      },
      { new: true }
    );
    return notify;
  }
  // public async isReadNotifyAll(): Promise<INotification> {
  //   const notify: any = await this.notificationSchema.f(
  //     { _id: notiId },
  //     {
  //       isRead: true,
  //     },
  //     { new: true }
  //   );
  //   return notify;
  // }
  public async deleteAllNotifies(userId: string) {
    await this.notificationSchema.deleteMany({ recipients: userId });
  }
}

export default NotificationService;
