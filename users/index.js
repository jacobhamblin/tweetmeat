const db = require('../db');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

module.exports = {
  login: (req, res) => {
    const { user } = req;

    const { user, password } = req.body;
    res.json(user);
    const sql = `INSERT INTO "user" (username, password) VALUES ('${username}', '${hash}');`;

    db.pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.log('Error in query: ');
        console.log(err);
      }

      console.log(result);
      res.status(201);
      res.send('User created');
    });
  },

  create: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    console.log(req);
    const { password, username } = req.body;
    console.log('username');
    console.log(username);
    console.log('password');
    console.log(password);

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

    const sql = `INSERT INTO "user" (username, password) VALUES ('${username}', '${hash}');`;

    db.pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.log('Error in query: ');
        console.log(err);
      }

      console.log(result);
      res.status(201);
      res.send('User created');
    });
  },

  logout: (req, res, next) => {
    req.session.destroy(err => {
      if (err) return next(err);
      req.logout();
      res.sendStatus(200);
    });
  },

  ping: function(req, res) {
    res.sendStatus(200);
  },
};
