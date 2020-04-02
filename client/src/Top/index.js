import React, { Component, useEffect } from 'react';
import './Top.css';
import _sortBy from 'lodash/sortBy';

export default class Top extends Component {
  state = {
    top: [],
  };
  componentDidMount() {
    this.fetchTopQueries();
  }
  useEffect(() => {
    this.fetchTopQueries();
  })
  fetchTopQueries = async () => {
    let url = '/api/top_queries';
    const response = await fetch(url);
    console.log('response');
    console.log(response);
    let top = await response.json();
    top = _sortBy(top, q => Number(q.count));
    top = top.reverse();
    top = top.slice(0, 10);
    this.setState({ top });
  };
  renderQuery(query) {
    return (
      <div className="query">
        <div className="count">{query.count}</div>
        <div className="name">{query.text}</div>
      </div>
    );
  }
  renderTopQueries() {
    return this.state.top.map(q => this.renderQuery(q));
  }
  render() {
    const { top } = this.state;
    console.log('hello from top');
    return (
      <div className="top-queries">
        {top.length ? <h2>Top Queries</h2> : null}
        <div className="queries">{this.renderTopQueries()}</div>
      </div>
    );
  }
}
