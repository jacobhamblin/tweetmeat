import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    query: '',
    tweets: [],
  };
  componentDidMount() {
    console.log('fetching tweets')
    this.fetchTweets();
  }
  fetchTweets = async event => {
    if (event) event.preventDefault();
    const { query } = this.state;
    const url = query ? `/api/tweets?q=${query}` : '/api/tweets';
    const response = await fetch(url);
    const tweets = await response.json();
    console.log('tweets')
    console.log(tweets)
    this.setState({ tweets: tweets.statuses });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  renderTweets = () => {
    const { tweets } = this.state;
    if (!tweets || !tweets.length) return;
    let renderedTweets = [];
    tweets.forEach(tweet => {
      renderedTweets.push(<div className="tweet">{tweet.text}</div>);
    });
    return (
      <div>
        <h1>tweets</h1>
        {renderedTweets}
      </div>
    );
  };
  render() {
    return (
      <div className="App">
        <form onSubmit={this.fetchTweets}>
          <label>Query</label>
          <input
            type="text"
            name="query"
            value={this.state.query}
            onChange={this.handleChange}
          />
          <button type="submit">Submit</button>
        </form>

        {this.renderTweets()}
      </div>
    );
  }
}
export default App;
