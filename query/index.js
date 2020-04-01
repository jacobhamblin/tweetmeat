const db = require('../db');
const { validationResult } = require('express-validator');
const moment = require('moment');

module.exports = {
  query: async (req, res, next) => {
    const query = req.query.q;
    const { username, id } = req.body;

    let queryID;
    const querySQL = `SELECT id, query, FROM query WHERE query=${query}`;
    db.pool.query(querySQL, function(err, result) {
      if (err) {
        console.log('Error in query: ');
        console.log(err);
      }

      if (result.rows.length > 0) {
        const first = result.rows[0];
        queryID = first.id;
      } else {
        const insertSQL = `INSERT INTO query (query) VALUES ('${query}') RETURNING id;`;
        db.pool.query(querySQL, function(err, result) {
          if (err) {
            console.log('Error in query: ');
            console.log(err);
          }

          console.log(result)
          queryID = result;
          console.log(queryID)
        });

      }
    });

    if (query) {
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
    // var recentQueryExists = false;
    // const query = `SELECT id, query_id, user_id, time FROM search WHERE user_id=${id} AND query_id=${} ORDER_BY time DESC`;
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
  },
};
