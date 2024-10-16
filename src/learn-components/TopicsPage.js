import React from 'react';

function TopicsPage({ topics }) {
  return (
    <div className="topics-container">
      <h3>Temos</h3>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>{topic.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopicsPage;
