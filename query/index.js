const db = require('../db');
const { validationResult } = require('express-validator');
const moment = require('moment');
const Twitter = require('../config/twitter');

module.exports = {
  query: async (req, res, next) => {
    const query = req.query.q;
    const user_id = req.query.user_id;

    if (query) {
      console.log('user_id')
      console.log(user_id)
      if (user_id) {
        let queryID;
        const querySQL = `SELECT id, text FROM query WHERE text=${query}`;
        db.pool.query(querySQL, function(err, result) {
          if (err) {
            console.log('Error in query: ');
            console.log(err);
          }

          if (result.rows.length > 0) {
            const first = result.rows[0];
            queryID = first.id;
            console.log('found an existing query')
            console.log('queryID')
            console.log(queryID)
          } else {
            const insertSQL = `INSERT INTO query (query) VALUES ('${query}') RETURNING id;`;
            db.pool.query(querySQL, function(err, result) {
              if (err) {
                console.log('Error in query: ');
                console.log(err);
              }

              console.log('result')
              console.log(result)
              queryID = result;
              console.log(queryID)
            });

          }
        });

        // var recentQueryExists = false;
        // const query = `SELECT id, query_id, user_id, time FROM search WHERE user_id=${user_id} AND query_id=${} ORDER_BY time DESC`;
        // db.pool.query(sql, function(err, result) {
          // if (err) {
            // console.log('Error in query: ');
            // console.log(err);
          // }

          // if (result.rows.length > 0) {
            // const first = result.rows[0];
            // if (moment(first.time).diff(moment(), 'hours') < 1) recentQueryExists = true;
          // }
        // });

        // const insert = `insert into times (time) values (to_timestamp(${Date.now()} / 1000.0))`;
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
