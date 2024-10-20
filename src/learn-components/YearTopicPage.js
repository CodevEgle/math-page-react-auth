import React, { useEffect, useState } from 'react';
import YearsService from '../services/YearsService';
import '../YearTopicPage.css';

function YearTopicPage({ year, topics, onBack, onLearn }) {
  const [theories, setTheories] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Received topics:', topics);

    if (!topics || topics.length === 0) {
      console.warn('No topics available.');
      return;
    }

    // Fetch theories for each topic
    const fetchAllTheories = async () => {
      setLoading(true);  // Set loading to true while fetching data
      try {
        const theoriesData = {};
        for (const topic of topics) {
          const response = await YearsService.getTheories(topic.id);  // Fetch theories for each topic
          theoriesData[topic.id] = response.data;  // Store the fetched theories data
        }
        setTheories(theoriesData);  // Set the state with all theories
      } catch (error) {
        console.error("Error fetching theories:", error);
      } finally {
        setLoading(false);  // Stop loading after the data is fetched
      }
    };

    if (topics.length > 0) {
      fetchAllTheories();
    }
  }, [topics]);

  // Handle topic selection
  const handleTopicClick = (topic) => {
    setSelectedTopic(selectedTopic === topic ? null : topic);  // Toggle selected topic
  };

  // Start learning for the selected topic
  const handleStart = (selectedTopic) => {
    onLearn({
      ...selectedTopic,
      theories: theories[selectedTopic.id] || [],  // Ensure theories are fetched
    });
  };

  return (
    <div className="years-page-wrapper">
      <div className="header-buttons">
        <button className="back-button" onClick={onBack}>Atgal į klases</button> {/* Call onBack to go back to YearsPage */}
      </div>

      <div className="years-container">
        <h1 className="years-title">{year.name}</h1>  {/* Display year.name */}
        <p className="years-description">Čia galite peržiūrėti ir pasirinkti temas, kurias norite mokytis.</p>

        {loading ? (
          <p className="loading-message">Loading theories...</p>
        ) : (!topics || topics.length === 0) ? (
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

            {/* Theories section */}
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
                  onClick={() => handleStart(selectedTopic)}  // Call handleStart when the button is clicked
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
