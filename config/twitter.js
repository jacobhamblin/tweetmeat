require('dotenv').config();

const Twitter = new require('twitter')({
  consumer_key: process.env.TwitterAPIKey,
  consumer_secret: process.env.TwitterAPIKeySecret,
  access_token_key: process.env.TwitterUserAccessToken,
  access_token_secret: process.env.TwitterUserAccessTokenSecret,
});

module.exports = Twitter;
