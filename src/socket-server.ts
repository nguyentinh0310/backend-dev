import { Logger } from "@core/utils";
import { IConversation } from "@modules/conversations";
import { INotification } from "@modules/notification";
import { IPost } from "@modules/posts";
import { IUser } from "@modules/users";
import socketIo from "socket.io";

let users: any = [];

const SocketServer = (socket: socketIo.Socket) => {
  //connect
  socket.on("join-user", (id) => {
    users.push({ id, socketId: socket.id });
    socket.emit("get-user", users);
    Logger.info({ users });
  });
  // disconnect
  socket.on("disconnect", () => {
    users = users.filter((user: any) => user.socketId !== socket.id);
  });

  // Likes
  socket.on("like-post", (post: IPost) => {
    const ids = [...post.user.followers, post.user._id];
    const clients = users.filter((user: any) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client: any) => {
        socket.to(`${client.socketId}`).emit("like-to-client", post);
      });
    }
  });

  // Unlike
  socket.on("unlike-post", (post) => {
    const ids = [...post.user.followers, post.user._id];
    const clients = users.filter((user: any) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client: any) => {
        socket.to(`${client.socketId}`).emit("unlike-to-client", post);
      });
    }
  });

  // Comment
  socket.on("create-comment", (post: IPost) => {
    // const ids = [...post.user.followers, post.user._id];
    const clients = users.filter((user: any) => post.user._id.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client: any) => {
        socket.to(`${client.socketId}`).emit("create-comment-to-client", post);
      });
    }
  });

  socket.on("delete-comment", (post: IPost) => {
    // const ids = [...post.user.followers, post.user._id];
    const clients = users.filter((user: any) => post.user._id.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client: any) => {
        socket.to(`${client.socketId}`).emit("delete-comment-to-client", post);
      });
    }
  });

  // Follow
  socket.on("follow", (newUser: IUser) => {
    const user = users.find((user: any) => user.id === newUser._id);
    if (user) {
      socket.to(`${user.socketId}`).emit("follow-to-client", newUser);
    }
  });

  // Unfollow
  socket.on("unFollow", (newUser: IUser) => {
    const user = users.find((user: any) => user.id === newUser._id);
    if (user) {
      socket.to(`${user.socketId}`).emit("unFollow-to-client", newUser);
    }
  });

  // Notification
  socket.on("create-notify", (msg: INotification) => {
    const client = users.find((user: any) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("create-notify-to-client", msg);
  });

  socket.on("remove-notify", (msg: INotification) => {
    const client = users.find((user: any) => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit("remove-notify-to-client", msg);
  });

  // Conversation
  // socket.on("send-coversation", ({ sender, recipient, text }) => {
  //   const user = users.find((user: any) => user.id === conv.);
  //   if (user) {
  //     socket.to(user.socketId).emit("get-coversation", {
  //       sender,
  //       text,
  //     });
  //   }
  // });

  // Messages
  socket.on("send-message", ({ sender, recipient, text }) => {
    const user = users.find((user: any) => user.id === recipient);
    if (user) {
      socket.to(user.socketId).emit("get-message", {
        sender,
        text,
      });
    }
  });
};

export default SocketServer;
