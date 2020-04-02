import React, { Component } from 'react';
import './Top.css';

export default class Top extends Component {
  state = {
    top: [],
  }
  componentDidMount() {
    this.fetchTopQueries();
  }
  fetchTopQueries = async () => {
    let url = '/api/top_queries';
    const response = await fetch(url);
    console.log('response')
    console.log(response)
    const top = await response.json();
    console.log('top')
    console.log(top)
    this.setState({ top });
  }
  render() {
    return <div />;
  }
}
