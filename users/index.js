const db = require('../db');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

module.exports = {
  login: (req, res) => {
    const { user } = req;

    res.json(user);
  },

  create: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { password, username } = req.body;

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const sql = `INSERT INTO "user" (username, password) VALUES ('${username}', '${hash}');`;

    db.pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.error(err);
      }

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
