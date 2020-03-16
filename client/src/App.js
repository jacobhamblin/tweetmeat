import React, { Component } from 'react'
import './App.css'

class App extends Component {
  state = {
    query: '',
    tweets: [],
  }
  componentDidMount() {
    this.fetchDefaultTweets()
  }
  fetchDefaultTweets = async () => {
    console.log('fetch Tweets')
    return
    const response = await fetch(`/api/moo`)
    const initialCow = await response.json()
    const cow = initialCow.moo
    this.setState({ cow })
  }
  fetchTweets = async event => {
    event.preventDefault()
    const { query } = this.state
    const response = await fetch(`/api/tweets?q=${query}`)
    const tweets = await response.json()
    console.log('fetched tweets')
    console.log(tweets.statuses)
    this.setState({ tweets: tweets.statuses, })
  }
  customCow = async event => {
    event.preventDefault()
    const { text } = this.state
    const response = await fetch(`/api/cow/${text}`)
    const custom = await response.json()
    const cow = custom.moo
    this.setState({ cow, text: '' })
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
    console.log(this.state.query)
  }
  renderTweets = () => {
    const { tweets } = this.state;
    console.log(tweets)
    if (!tweets || !tweets.length) return;
    let renderedTweets = [];
    tweets.forEach(tweet => {
      renderedTweets.push(
        <div class='tweet'>{tweet.text}</div>
      )
    })
    return (
      <div>
        <h1>tweets</h1>
        {renderedTweets}
      </div>
    )
  }
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
    )
  }
}
export default App
