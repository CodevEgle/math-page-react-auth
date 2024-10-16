import React, { useEffect, useState } from 'react';
import YearsService from '../services/YearsService';
import '../YearTopicPage.css';

function YearTopicPage({ year, topics, onBack }) {
  const [theories, setTheories] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Add a log to verify if topics are passed correctly
  useEffect(() => {
    console.log('Received topics:', topics);

    if (!topics || topics.length === 0) {
      console.warn('No topics available.');
      return;
    }

    const fetchAllTheories = async () => {
      try {
        const theoriesData = {};
        for (const topic of topics) {
          // Mock fetching subtopics or use your service here
          const response = await YearsService.getTheories(topic.id);
          theoriesData[topic.id] = response.data;  // Store the fetched subtopics data
        }
        setTheories(theoriesData);  // Set the state with all subtopics
      } catch (error) {
        console.error("Error fetching subtopics:", error);
      }
    };

    if (topics.length > 0) {
      fetchAllTheories();  // Fetch subtopics only if topics exist
    }
  }, [topics]);

  // Function to toggle the display of subtopics
  const handleTopicClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null); // Close the subtopics table if the same topic is clicked again
    } else {
      setSelectedTopic(topic); // Show subtopics for the clicked topic
    }
  };

  return (
    <div className="years-page-wrapper">
      <div className="header-buttons">
        <button className="back-button" onClick={onBack}>Atgal į klases</button> {/* Call onBack to go back to YearsPage */}
        <button className="user-info-button">Vartotojo informacija</button>
      </div>

      <div className="years-container">
        <h1 className="years-title">{year}</h1>
        <p className="years-description">Čia galite peržiūrėti ir pasirinkti temas, kurias norite mokytis.</p>

        {(!topics || topics.length === 0) ? (
          <p className="no-topics-message">Nėra prieinamų temų šioje klasėje.</p>
        ) : (
          <div className="topics-content-wrapper">
            <div className="topics-container">
              <ul className="topics-list">
                {topics.map((topic, index) => (
                  <li key={index} className="topic-item">
                    <button
                      className={`topic-button ${theories[topic.id] && theories[topic.id].length > 0 ? 'active' : 'inactive'}`}
                      onClick={() => handleTopicClick(topic)}
                    >
                      {topic.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subtopics table on the right-hand side */}
            {selectedTopic && (
              <div className="topic-details">
                <h2>{selectedTopic.title}</h2>
                <ul className="subtopics-list">
                  {theories[selectedTopic.id] && theories[selectedTopic.id].map((theory) => (
                    <li key={theory.id} className="subtopic-item">{theory.title}</li>
                  ))}
                </ul>
                <button
                  className="learn-button"
                  onClick={() => console.log('Pradėti mokytis:', selectedTopic)}
                >
                  Pradėti mokytis
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default YearTopicPage;
