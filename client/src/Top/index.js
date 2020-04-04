import React, { useState, useEffect } from 'react';
import './Top.css';
import _sortBy from 'lodash/sortBy';

function Top({ updateCount }) {
  const [top, setTop] = useState([]);
  const fetchTopQueries = async () => {
    let url = '/api/top_queries';
    const response = await fetch(url);
    console.log('response');
    console.log(response);
    let top = await response.json();
    top = _sortBy(top, q => Number(q.count));
    top = top.reverse();
    top = top.slice(0, 10);
    setTop(top);
  };
  const renderQuery = query => {
    return (
      <div className="query">
        <div className="count">{query.count}</div>
        <div className="name">{query.text}</div>
      </div>
    );
  };
  const renderTopQueries = () => {
    var items = [{"query_id":2,"text":"bae","count":"13"},{"query_id":4,"text":"covid-19","count":"5"},{"query_id":1,"text":"bay","count":"3"},{"query_id":3,"text":"corona","count":"2"},{"query_id":6,"text":"#stayhome","count":"2"},{"query_id":9,"text":"hello","count":"1"},{"query_id":10,"text":"hi","count":"1"}];
    return items.map(q => renderQuery(q));
  };
  useEffect(() => {
    console.log(updateCount)
    fetchTopQueries();
  }, [updateCount]);
  return (
    <div className="top-queries">
      {top.length ? <h2>Top Queries</h2> : null}
      <div className="queries">{renderTopQueries()}</div>
    </div>
  );
}

export default Top;
