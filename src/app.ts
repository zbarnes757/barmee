import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import * as bluebird from "bluebird";
import * as bodyParser from "body-parser";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as helmet from "helmet";
import mongoose = require("mongoose");
import * as logger from "morgan";
import * as passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { SessionRoute } from "./routes/sessions";
import schema = require("./schema");

// interfaces
import { IUser } from "./interfaces/user"; // import IUser

// models
import { IModel } from "./models/model"; // import IModel
import { IUserModel } from "./models/user"; // import IUserModel

// schemas
import { userSchema } from "./mongoSchemas/user"; // import userSchema

// Setup passport jwt
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "kitty-kats",
};

export class Server {
  public static bootstrap(): Server {
    return new Server();
  }

  public app: express.Application;

  public connection: mongoose.Connection;

  public model: IModel;

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.model = Object();

    this.app = express();

    this.config();

    this.routes();
  }

  /**
   * config
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    const MONGODB_CONNECTION: string = process.env.MONGODB_CONNECTION || "mongodb://localhost:27017/barmee";

    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(helmet());

    global.Promise = bluebird;
    mongoose.Promise = global.Promise;

    const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
    this.connection = connection;
    this.model.user = connection.model<IUserModel>("User", userSchema);

    // Setup passport
    passport.use(new Strategy(
      jwtOpts,
      (jwtPayload, done): any => {
        return this.model.user
          .findById(jwtPayload.id)
          .then((user) => {
            if (!user) { return done(null, false); }

            return done(null, user);
          })
          .catch(() => done(null, false));
      },
    ));

    passport.serializeUser((user: IUserModel, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      const user = await this.model.user
        .findById(id);

      done(null, user);
    });

    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private routes() {
    let router: express.Router;
    router = express.Router();

    // Sessions Routes
    SessionRoute.create(router, this.model);

    this.app.use(router);

    // Setup graphql
    this.app.use(
      "/graphql",
      bodyParser.json(),
      passport.authenticate("jwt", { session: false }),
      graphqlExpress((req) => ({ schema, context: { user: req.user } })),
    );
    // catch 404 and forward to error handler
    this.app.use((req: Request, res: Response): Response => res.status(404).send("Page not found."));

    // error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.json("error");
      next();
    });
  }
}
