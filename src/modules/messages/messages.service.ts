import { HttpException } from "@core/exceptions";
import { ListResponse } from "@core/interfaces";
import { APIfeatures, isEmptyObject } from "@core/utils";
import { ConversationSchema } from "@modules/conversations";
import MessageDto from "./dtos/message.dto";
import { IMessage } from "./messages.interface";
import MessageSchema from "./messages.model";

class MessageService {
  private conversationSchema = ConversationSchema;
  private messageSchema = MessageSchema;

  public async addMessage(messageDto: MessageDto, userId: string): Promise<IMessage> {
    if (isEmptyObject(messageDto)) {
      throw new HttpException(400, "Model is empty");
    }
    let { sender, recipient, text, media, call } = messageDto;
    sender = userId;

    const newConversation = await this.conversationSchema
      .findOneAndUpdate(
        {
          $or: [{ recipients: [sender, recipient] }, { recipients: [recipient, sender] }],
        },
        {
          recipients: [sender, recipient],
          text,
          media,
          call,
        },
        { new: true, upsert: true }
      )
      .exec();

    const newMessage = new this.messageSchema({
      conversation: newConversation._id,
      sender,
      call,
      recipient,
      text,
      media,
    });

    await newMessage.save();

    return newMessage;
  }

  public async getMessages(
    fromUserId: string,
    toUserId: string,
    query: any
  ): Promise<ListResponse<IMessage>> {
    const features = new APIfeatures(
      this.messageSchema.find({
        $or: [
          { sender: fromUserId, recipient: toUserId },
          { sender: toUserId, recipient: fromUserId },
        ],
      }),
      query
    ).paginating();

    const messages = await features.query;
    const rowCount = messages.length;

    return {
      data: messages,
      totalRows: rowCount,
    };
  }

  public async deleteMessage(userId: string, messageId: string) {
    const message = await this.messageSchema.findById(messageId).exec();
    if (!message) throw new HttpException(400, "Message not found");
    if (message.sender.toString() !== userId)
      throw new HttpException(400, "User is not authorized");

    await message.remove();
    return message;
  }
}

export default MessageService;
