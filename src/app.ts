import { Route } from "@core/interfaces";
import { errorMiddleware } from "@core/middlewares";
import { Logger } from "@core/utils";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import http from "http";
import mongoose, { ConnectOptions } from "mongoose";
import morgan from "morgan";
import socketServer from "./socket-server";
import socketIo from "socket.io";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

class App {
  public app: express.Application;
  public port: string | number;
  public production: boolean;
  public server: http.Server;
  public io: socketIo.Server;

  constructor(routes: Route[]) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new socketIo.Server(this.server);
    this.port = process.env.PORT || 5000;
    this.production = process.env.NODE_ENV == "production" ? true : false;

    this.connectDatabase();
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeErrorMiddleware();
    this.initializeSwagger();
    this.initSocketIo();
  }
  private initSocketIo() {
    this.server = http.createServer(this.app);
    this.io = new socketIo.Server(this.server, {
      cors: {
        origin: "*",
      },
    });
    this.app.set("socketio", this.io);

    this.io.on("connection", (socket: socketIo.Socket) => {
      Logger.warn("a user connected : " + socket.id);
      socketServer(socket)
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      Logger.info(`Server is listening on port ${this.port}`);
    });
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeMiddleware() {
    if (this.production) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(morgan("combined"));
    } else {
      this.app.use(morgan("dev"));
    }
    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  private connectDatabase() {
    const connectString = process.env.MONGODB_URI;
    if (!connectString) {
      Logger.error("Connection string is invalid");
      return;
    }
    mongoose.connect(
      connectString,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions,
      (err: any) => {
        if (err) {
          Logger.error("Can not to mongodb!");
          Logger.error(err);
        } else {
          Logger.info("Connected to MongoDB");
        }
      }
    );
  }

  private initializeSwagger() {
    const swaggerDocument = YAML.load("./src/swagger.yaml");

    this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

export default App;
