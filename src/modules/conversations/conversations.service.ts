import { HttpException } from "@core/exceptions";
import { ListResponse } from "@core/interfaces";
import { APIfeatures } from "@core/utils";
import { MessageSchema } from "@modules/messages";
import { IConversation } from "./conversations.interface";
import ConversationSchema from "./conversations.model";

class ConversationService {
  private conversationSchema = ConversationSchema;
  private messageSchema = MessageSchema;

  public async getConversations(userId: string, query: any): Promise<ListResponse<IConversation>> {
    const features = new APIfeatures(
      this.conversationSchema
        .find({ recipients: userId })
        .populate("recipients", "avatar account fullname")
        .sort("-updatedAt"),
      query
    );

    const convRead = await this.conversationSchema
      .find({ recipients: userId, isRead: false })
      .exec();

    const conversations = await features.query;
    const rowCount = convRead.length;

    return {
      data: conversations,
      totalRows: rowCount,
    };
  }

  public async isReadConv(userId: string) {
    const conversation: any = await this.conversationSchema.findOneAndUpdate(
      { recipients: userId },
      {
        isRead: true,
      },
      { new: true }
    );
    return conversation;
  }

  public async isUnReadConv(userId: string) {
    const conversation: any = await this.conversationSchema.findOneAndUpdate(
      { recipients: userId },
      {
        isRead: false,
      },
      { new: true }
    );
    return conversation;
  }

  public async deleteConversation(fromUserId: string, toUserId: string){
    const newConv = await this.conversationSchema
      .findOneAndDelete({
        $or: [
          { recipients: [fromUserId, toUserId] },
          { recipients: [toUserId, fromUserId] },
        ],
      })
      .exec();

    if (!newConv) throw new HttpException(400, "Conversation is not found");
    await this.messageSchema.deleteMany({ conversation: newConv?._id });

  }
}

export default ConversationService;
