const bcrypt = require('bcrypt')
const winston = require('winston')
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('../db');

module.exports = (passport, db) => {
  passport.use(new Strategy((username, password, cb) => {
    db.query('SELECT id, username, password, type FROM user WHERE username=$1', [username], (err, result) => {
      if(err) {
        winston.error('Error when selecting user on login', err)
        console.log('username')
        console.log(username)
        return cb(err)
      }

      if(result.rows.length > 0) {
        const first = result.rows[0]
        bcrypt.compare(password, first.password, function(err, res) {
          if(res) {
            cb(null, { id: first.id, username: first.username, type: first.type })
           } else {
            cb(null, false)
           }
         })
       } else {
         cb(null, false)
       }
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, cb) => {
    db.query('SELECT id, username, type FROM user WHERE id = $1', [parseInt(id, 10)], (err, results) => {
      if(err) {
        winston.error('Error when selecting user on session deserialize', err)
        return cb(err)
      }

      cb(null, results.rows[0])
    })
  })
}
