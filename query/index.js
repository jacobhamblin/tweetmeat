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
      if (res.rows.length > 0) {
        const first = res.rows[0];
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

    if (query) {
      query = query.toLowerCase();
      if (userID) {
        const queryID = await getQueryID(query);
        var needToInsert = true;
        const querySQL = `SELECT * FROM search WHERE user_id=${userID} AND query_id=${queryID} ORDER BY time DESC`;
        needToInsert = await db.pool
          .query(querySQL)
          .then(res => {
            if (res.rows.length > 0) {
              const first = res.rows[0];
              if (moment(first.time).diff(moment(), 'hours') > -1) return false;
            }
            return true;
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
        count: 100,
      };
      try {
        Twitter.get('search/tweets', params, (error, tweets, response) => {
          res.json(tweets);
        });
      } catch (err) {
        console.error(err);
        next(err);
      }
    } else {
      const sampleQueries = [
        'covid-19',
        '#generalconference',
        'bae',
        'apple',
        'linux',
        'bitcoin',
        'magic',
      ];
      const q = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      const params = {
        q,
        response_type: 'popular',
        count: 100,
      };
      try {
        Twitter.get('search/tweets', params, (error, tweets, response) => {
          res.json(tweets);
        });
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
  },
  top_queries: async (req, res, next) => {
    const querySQL =
      'SELECT s.query_id, q.text, s.count FROM ( SELECT query_id, count(*) AS count FROM search GROUP BY query_id ORDER BY count DESC) s JOIN query q ON s.query_id = q.id ORDER BY s.count DESC';
    db.pool
      .query(querySQL)
      .then(result => {
        res.status(200);
        res.json(result.rows);
      })
      .catch(e => console.error(e));
  },
};
