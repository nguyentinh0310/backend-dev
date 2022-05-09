import "dotenv/config";
import App from "./app";
import { validateEnv } from "@core/utils";
import { IndexRoute } from "@modules/index";
import { UsersRoute } from "@modules/users";
import AuthRoute from "@modules/auth/auth.route";
import { ProfileRoute } from "@modules/profile";
import { PostRoute } from "@modules/posts";
import { CommentRoute } from "@modules/comment";
import { MessageRoute } from "@modules/messages";
import { ConversationRoute } from "@modules/conversations";
import { NotificationRoute } from "@modules/notification";

validateEnv();

const routes = [
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new PostRoute(),
  new CommentRoute(),
  new MessageRoute(),
  new ConversationRoute(),
  new NotificationRoute(),
];

const app = new App(routes);

app.listen();
