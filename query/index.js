const db = require('../db');
const { validationResult } = require('express-validator');
const moment = require('moment');
const Twitter = require('../config/twitter');

module.exports = {
  query: async (req, res, next) => {
    const query = req.query.q;
    const userID = req.query.user_id;

    if (query) {
      console.log('userID')
      console.log(userID)
      if (userID) {
        let queryID;
        let querySQL = `SELECT id, text FROM query WHERE text='${query}'`;
        db.pool.query(querySQL, function(err, result) {
          if (err) {
            console.log('Error in query: ');
            console.log(err);
          }

          if (result.rows.length > 0) {
            const first = result.rows[0];
            queryID = first.id;
          } else {
            let insertSQL = `INSERT INTO query (text) VALUES ('${query}') RETURNING id;`;
            db.pool.query(insertSQL, function(err, result) {
              if (err) {
                console.log('Error in query: ');
                console.log(err);
              }

              queryID = result.rows[0].id;
            });

          }
        });

        var recentQueryExists = false;
        querySQL = `SELECT id, query_id, user_id, time FROM search WHERE user_id='${userID}' AND query_id='${queryID}' ORDER_BY time DESC`;
        db.pool.query(querySQL, function(err, result) {
          if (err) {
            console.log('Error in query: ');
            console.log(err);
          }

          if (result.rows.length > 0) {
            const first = result.rows[0];
            if (moment(first.time).diff(moment(), 'hours') < 1) recentQueryExists = true;
          }
        });


        if (!recentQueryExists) {
          insertSQL = `INSERT INTO search (user_id, query_id, time) values ('${userID}', '${queryID}', to_timestamp(${Date.now()} / 1000.0))`;
          db.pool.query(insertSQL, function(err, result) {
            if (err) {
              console.log('Error in query: ');
              console.log(err);
            }
          });
        }
      }


      const params = {
        q: query,
        response_type: 'popular',
      };
      try {
        Twitter.get('search/tweets', params, (error, tweets, response) => {
          res.json(tweets);
        });
      } catch (err) {
        next(err);
      }
    } else {
      try {
        Twitter.get('statuses/sample', (error, tweets, response) => {
          console.log('server, callback');
          console.log(tweets);
          res.json(tweets);
        });
      } catch (err) {
        console.log('server, error');
        console.log(err);
        next(err);
      }
    }
  },
};
