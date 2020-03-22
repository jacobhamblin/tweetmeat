const db = require('../db')
const { validationResult } = require('express-validator');

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
    User.create({
      username: req.body.username,
      password: req.body.password
    }).then(user => res.json(user))

    const { password, username } = req.body;

    const sql = `INSERT INTO "user" (username, password) VALUES ('${user}', '${password}');`

    pool.query(sql, function(err, result) {
      // If an error occurred...
      if (err) {
        console.log("Error in query: ")
        console.log(err);
      }

      res.status(201)
      res.send('User created')
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
