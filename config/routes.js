const cors = require('cors');
const path = require('path');
const { requiresLogin, requiresAdmin } = require('./middlewares/authorization');
const { check } = require('express-validator');
const users = require('../users');
const query = require('../query');
const { loggedIn } = require('./utils');

module.exports = (app, passport, db) => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
  });
  app.post('/api/login', passport.authenticate('local'), users.login);
  app.post('/api/user', users.create);
  app.get('/api/logout', users.logout);
  app.get('/api/ping', users.ping);

  app.get('/api/tweets/', cors(), query.query);

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/login.html'));
  });
  app.use(function(err, req, res, next) {
    if (err.message && ~err.message.indexOf('not found')) {
      return next();
    }

    console.error(err.stack);

    return res.status(500).json({ error: 'Error on backend occurred.' });
  });

  app.use(function(req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found',
    };
    if (req.accepts('json')) return res.status(404).json(payload);

    res.status(404).render('404', payload);
  });
};
