const db = require('../db');
const { validationResult } = require('express-validator');
const moment = require('moment');
const Twitter = require('../config/twitter');

const getQueryID = async query => {
  var queryID;
  const querySQL = `SELECT id, text FROM query WHERE text='${query}'`;
  return await db.pool
    .query(querySQL)
    .then(async res => {
      if (result.rows.length > 0) {
        const first = result.rows[0];
        return first.id;
      } else {
        const insertSQL = `INSERT INTO query (text) VALUES ('${query}') RETURNING id;`;
        await db.pool
          .query(insertSQL)
          .then(res => res.rows[0].id)
          .catch(e => console.error(e));
      }
    })
    .catch(e => console.error(e));
};

module.exports = {
  query: async (req, res, next) => {
    let query = req.query.q;
    const userID = req.query.user_id;
    query = query.toLowerCase();

    if (query) {
      console.log('userID');
      console.log(userID);
      if (userID) {
        const queryID = await getQueryID(query);
        console.log('queryID');
        console.log(queryID);
        var needToInsert = true;
        const querySQL = `SELECT * FROM search WHERE user_id=${userID} AND query_id=${queryID} ORDER BY time DESC`;
        console.log(querySQL);
        needToInsert = await db.pool
          .query(querySQL)
          .then(res => {
            if (result.rows.length > 0) {
              const first = result.rows[0];
              if (moment(first.time).diff(moment(), 'hours') < 1) return false;
            }
          })
          .catch(e => console.error(e));
        if (needToInsert) {
          const insertSQL = `INSERT INTO search (user_id, query_id, time) values ('${userID}', '${queryID}', to_timestamp(${Date.now()} / 1000.0))`;
          await db.pool.query(insertSQL).catch(e => console.error(e));
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
  top_queries: async (req, res, next) => {
    const querySQL =
      'SELECT s.query_id, q.text, s.count FROM ( SELECT query_id, count(*) AS count FROM search GROUP BY query_id ORDER BY count DESC) s JOIN query q ON s.query_id = q.id';
    db.pool.query(querySQL, function(err, result) {
      if (err) {
        console.log('Error in query: ');
        console.log(err);
      }
      res.status(200);
      res.json(result.rows);
    });
  },
};
