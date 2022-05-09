import { ListResponse } from "@core/interfaces";
import { APIfeatures } from "@core/utils";
import { MessageSchema } from "@modules/messages";
import { IConversation } from "./conversations.interface";
import ConversationSchema from "./conversations.model";

class ConversationService {
  private conversationSchema = ConversationSchema;
  private messageSchema = MessageSchema;

  public async getConversations(query: any): Promise<ListResponse<IConversation>> {
    const features = new APIfeatures(
      this.conversationSchema.find({}).populate("recipients", "avatar account fullname"),
      query
    );

    const conversations = await features.query;
    const rowCount = await this.conversationSchema.countDocuments().exec();

    return {
      data: conversations,
      totalRows: rowCount,
    };
  }

  public async deleteConversation(fromUserId: string, toUserId: string) {
    const newConv = await this.conversationSchema.findOneAndDelete({
      $or: [
        { sender: fromUserId, recipient: toUserId },
        { sender: toUserId, recipient: fromUserId },
      ],
    }).exec()
    await this.messageSchema.deleteMany({collection: newConv?._id})
  }
}

export default ConversationService;
