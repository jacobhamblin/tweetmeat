const express = require('express');
const cowsay = require('cowsay');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const Twitter = new require('twitter')({
  consumer_key: process.env.TwitterAPIKey,
  consumer_secret: process.env.TwitterAPIKeySecret,
  access_token_key: process.env.TwitterUserAccessToken,
  access_token_secret: process.env.TwitterUserAccessTokenSecret,
});

// Create the server
const app = express();

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/tweets/', cors(), async (req, res, next) => {
  const query = req.query.q;

  if (query) {
    try {
      Twitter.get('search/tweets', { q: query }, (error, tweets, response) => {
        res.json(tweets);
      });
    } catch (err) {
      next(err);
    }
  } else {
    try {
      Twitter.get(
        'statuses/sample',
        { q: query },
        (error, tweets, response) => {
          res.json(tweets);
        },
      );
    } catch (err) {
      next(err);
    }
  }
});

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Choose the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Watching port ${PORT}`);
});
