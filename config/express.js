const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
// const config = require('./');

const env = process.env.NODE_ENV || 'development';

module.exports = (app, passport, pool) => {
  let log = 'dev';
  if (env !== 'development') {
    log = {
      stream: {
        write: message => console.log(message),
      },
    };
  }

  app.use(express.static(path.join(__dirname, 'client/build')));
  // app.set('views', path.join(config.root, 'views'));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    methodOverride(function(req) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
      }
    }),
  );

  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(
    session({
      store: new pgSession({
        pool,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // app.use('/', express.static(path.join(config.root, 'public')));
};
