import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
import * as helmet from 'helmet';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as logger from 'morgan';
import * as passport from 'passport';
import * as bluebird from 'bluebird';

global.Promise = bluebird;

const sessions = require('./routes/sessions');
const schema = require('./schema');
import User from './models/user';

const app = express();

// Setup passport jwt
const jwtOpts = {
  secretOrKey: process.env.JWT_SECRET || 'kitty-kats',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(new Strategy(
  jwtOpts,
  (jwtPayload, done): any => {
    return User
      .forge({ id: jwtPayload.id })
      .fetch()
      .then((user) => {
        if (!user) { return done(null, false); }

        return done(null, user);
      })
      .catch(() => done(null, false));
  },
));

passport.serializeUser((user: User, done) => {
  done(null, user.get('id'));
});

passport.deserializeUser(async (id: String, done) => {
  const user = await User
    .forge({ id })
    .fetch();
  done(null, user);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

// Routes

app.use('/sessions', sessions);
app.use(
  '/graphql',
  bodyParser.json(),
  passport.authenticate('jwt', { session: false }),
  graphqlExpress(req => ({ schema, context: { user: req.user } })),
);

// catch 404 and forward to error handler
app.use((req: Request, res: Response): Response => res.status(404).send('Page not found.'));

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
  next();
});

module.exports = app;
