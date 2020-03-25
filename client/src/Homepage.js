import React, { Component } from 'react';
import Login from './Login';
import './App.css';

class Homepage extends Component {
  state = {
    query: '',
    tweets: [],
    queryParams: { get: () => {} },
    login: false,
  };
  componentDidMount() {
    console.log('fetching tweets');
    this.setQueryParams();
    this.fetchTweets();
  }
  maybeOpenLogin = (queryParams) => {
    console.log('what is in query params')
    console.log(queryParams.get('login'))
    if (queryParams.get('login')) this.setState({login: true})
  };
  setQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    this.setState({ queryParams });
    this.maybeOpenLogin(queryParams);
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  toggleLogin = () => {
    const { login } = this.state;
    console.log('login is')
    console.log(login)
    this.setState({ login: !login });
  };
  fetchTweets = async event => {
    if (event) event.preventDefault();
    const { query } = this.state;
    const url = query ? `/api/tweets?q=${query}` : '/api/tweets';
    const response = await fetch(url);
    const tweets = await response.json();
    console.log('tweets');
    console.log(tweets);
    this.setState({ tweets: tweets.statuses });
  };
  renderTweets = () => {
    const { tweets } = this.state;
    if (!tweets || !tweets.length) return;
    let renderedTweets = [];
    tweets.forEach(tweet => {
      renderedTweets.push(<p className="tweet">{tweet.text}</p>);
    });
    return (
      <div>
        <h1>tweets</h1>
        {renderedTweets}
      </div>
    );
  };
  render() {
    const { showSnackbar } = this.props;
    const { login } = this.state;
    return (
      <div className="App">
        <div className="column">
        </div>
        <div className="column main">
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
        <div className="column right">
          <a onClick={this.toggleLogin}>Login</a>
        </div>

        <Login active={login} close={this.toggleLogin} showSnackbar={showSnackbar} />
      </div>
    );
  }
}
export default Homepage;
