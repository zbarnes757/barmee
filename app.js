const bodyParser = require('body-parser');
const boom = require('express-boom');
const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const helmet = require('helmet');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const logger = require('morgan');
const passport = require('passport');

global.Promise = require('bluebird');

const sessions = require('./routes/sessions');
const schema = require('./schema');
const User = require('./models/user');

const app = express();

// Setup passport jwt
const jwtOpts = {
  secretOrKey: process.env.JWT_SECRET || 'kitty-kats',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(new JwtStrategy(
  jwtOpts,
  async (jwtPayload, done) => {
    try {
      const user = await new User({ id: jwtPayload.id }).fetch();
      if (!user) { return done(null, false); }

      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  },
));

passport.serializeUser((user, done) => {
  done(null, user.get('id'));
});

passport.deserializeUser(async (id, done) => {
  const user = await new User({ id }).fetch();
  done(null, user);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(boom());
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

if (process.env.NODE_ENV === 'dev') {
  app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

// catch 404 and forward to error handler
app.use((req, res) => res.boom.notFound());

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
