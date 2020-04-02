import React, { Component } from 'react';
import './Top.css';
import _sortBy from 'lodash/sortBy';

export default class Top extends Component {
  state = {
    top: [],
  }
  componentDidMount() {
  }
  fetchTopQueries = async () => {
    let url = '/api/top_queries';
    const response = await fetch(url);
    console.log('response')
    console.log(response)
    let top = await response.json();
    _sortBy(top, q => Number(q.count));
    this.setState({ top });
  }
  renderQuery(query) {
    return (
      <div className='query'>
        <div className='count'>{query.count}</div>
        <div className='name'>{query.text}</div>
      </div>
    )
  }
  renderTopQueries() {
    return this.state.top.map(q => this.renderQuery(q))
  }
  render() {
    console.log('hello from top')
    return (
      <div className='top-queries'>
        <h2>Top Queries</h2>
        <div className='queries'>
          {this.renderTopQueries()}
        </div>
      </div>
    )
  }
}
