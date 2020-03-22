const pg = require('pg');
// const config = require('../config');

// const dbConfig = {
  // user: config.db.user,
  // password: config.db.password,
  // database: config.db.database,
  // host: config.db.host,
  // port: config.db.port,
  // max: config.db.max,
  // idleTimeoutMillis: config.db.idleTimeoutMillis,
// };

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString: connectionString });
pool.on('error', function(err) {
  console.error('idle client error', err.message, err.stack);
});

module.exports = {
  pool,
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
