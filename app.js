const bodyParser = require('body-parser');
const boom = require('express-boom');
const express = require('express');
const helmet = require('helmet');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const logger = require('morgan');
const path = require('path');
const passport = require('passport');

global.Promise = require('bluebird');

const sessions = require('./routes/sessions');

const User = require('./models/user');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'kitty-kats';

// Setup passport jwt
const jwtOpts = {
  secretOrKey: process.env.JWT_SECRET || 'kitty-kats',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(jwtOpts,
  async (jwtPayload, done) => {
    try {
      const user = await new User({ id: jwtPayload.id }).fetch();
      if (!user) { return done(null, false); }

      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log('serialize user', user);
  done(null, user.get('id'))
});

passport.deserializeUser(async (id, done) => {
  console.log('deserialize', id);
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

app.use('/sessions', sessions);

// catch 404 and forward to error handler
app.use((req, res, next) => res.boom.notFound());

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;