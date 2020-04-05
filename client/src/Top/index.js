import React, { useState, useEffect } from 'react';
import './Top.css';
import _sortBy from 'lodash/sortBy';

function Top({ updateCount }) {
  const [top, setTop] = useState([]);
  const fetchTopQueries = async () => {
    let url = '/api/top_queries';
    const response = await fetch(url);
    let top = await response.json();
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
    return top.map(q => renderQuery(q));
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
