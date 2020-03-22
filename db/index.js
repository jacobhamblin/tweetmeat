const pg = require('pg');
// const config = require('../config');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  max: process.env.DB_MAX,
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT,
};

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
