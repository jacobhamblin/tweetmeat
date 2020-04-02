import React, { Component } from 'react';
import { stringify } from 'query-string';
import Login from './Login';
import Top from './Top';
import './App.css';

class Homepage extends Component {
  state = {
    query: '',
    tweets: [],
    queryParams: { get: () => {} },
    login: false,
    loggedIn: false,
    user: { id: '', username: '' },
  };
  componentDidMount() {
    this.setQueryParams();
    this.fetchTweets();
  }
  maybeOpenLogin = queryParams => {
    if (queryParams.get('login')) this.setState({ login: true });
  };
  setQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    this.setState({ queryParams });
    this.maybeOpenLogin(queryParams);
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  logout = async () => {
    const { username, password } = this.state;
    const response = await fetch('/api/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    var message = 'Logged out!';
    if (response.status == 200) {
      this.toggleLoggedIn();
    } else {
      message = 'Request rejected!';
    }
    this.props.showSnackbar(message);
  };
  setUser = ({ id, username }) => {
    this.setState({user: { id, username }});
  };
  toggleLogin = () => {
    const { login } = this.state;
    this.setState({ login: !login });
  };
  toggleLoggedIn = () => {
    const { loggedIn } = this.state;
    this.setState({ loggedIn: !loggedIn });
  };
  fetchTweets = async event => {
    if (event) event.preventDefault();
    const { user, query } = this.state;
    const data = {};
    if (query) data.q = query;
    if (user.id) data.user_id = user.id;
    const queryString = stringify({ ...data });
    let url = '/api/tweets';
    if (queryString) url += '?' + queryString;
    const response = await fetch(url);
    const tweets = await response.json();
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
        <div className='tweets-container'>
          {renderedTweets}
        </div>
      </div>
      );
  };
  render() {
    const { showSnackbar } = this.props;
    const { login, user } = this.state;
    return (
      <div className="App">
        <div className="col-xs-12 col-sm-3 column" />
        <div className="col-xs-12 col-sm-6 column">
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
        <div className="col-xs-12 col-sm-3 column right">
          {this.state.loggedIn ? (
            <div>
              <div>Welcome, {user.username}</div>
              <a onClick={this.logout} className='login'>Log out</a>
            </div>
          ) : (
            <a onClick={this.toggleLogin} className='login'>Log in</a>
          )}
          <Top />
        </div>

        <Login
          active={login}
          close={this.toggleLogin}
          setSessionState={this.toggleLoggedIn}
          setUser={this.setUser}
          showSnackbar={showSnackbar}
        />
      </div>
    );
  }
}
export default Homepage;
