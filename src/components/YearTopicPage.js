import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import './YearTopicPage.css';

function YearTopicPage() {
  const { yearName } = useParams();
  const location = useLocation();
  const { topics } = location.state || {}; // Patikriname, ar yra topics
  const [subtopics, setSubtopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSubtopics = async () => {
      try {
        const subtopicsData = {};
        for (const topic of topics) {
          const response = await fetch(`http://localhost:8080/api/topics/${topic.id}/subtopics`);
          const data = await response.json();
          subtopicsData[topic.id] = data;
        }
        setSubtopics(subtopicsData);
      } catch (error) {
        console.error("Klaida gaunant subtopics:", error);
      }
    };

    if (topics.length > 0) {
      fetchAllSubtopics();
    }
  }, [topics]);

  // Funkcija, kuri parodo lentelę su subtopics
  const handleTopicClick = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null); // Uždaro lentelę, jei paspaustas tas pats mygtukas
    } else {
      setSelectedTopic(topic); // Parodo subtopics lentelę
    }
  };

  const handleLearnClick = (topic) => {
    navigate(`/learn/${topic.id}`, { state: { subtopics: subtopics[topic.id], topicTitle: topic.title } }); // Naudojame ID vietoj pavadinimo
  };

  return (
    <div className="years-page-wrapper">
      <div className="header-buttons">
        <div className="left-buttons">
          <button className="back-button" onClick={() => navigate(-1)}>Atgal</button>
          <Link to="/" className="back-home-button">Atgal į pradžią</Link>
        </div>
        <button className="user-info-button">Vartotojo informacija</button>
      </div>

      <div className="years-container">
        <h1 className="years-title">{yearName}</h1>
        <p className="years-description">Čia galite peržiūrėti ir pasirinkti temas, kurias norite mokytis.</p>

        <div className="topics-content-wrapper">
          <div className="topics-container">
            <ul className="topics-list">
              {topics.map((topic, index) => (
                <li key={index} className="topic-item">
                  <button
                    className={`topic-button ${subtopics[topic.id] && subtopics[topic.id].length > 0 ? 'active' : 'inactive'}`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    {topic.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Lentelė su subtopics dešinėje pusėje */}
          {selectedTopic && (
            <div className="topic-details">
              <h2>{selectedTopic.title}</h2>
              <ul className="subtopics-list">
                {subtopics[selectedTopic.id] && subtopics[selectedTopic.id].map((subtopic) => (
                  <li key={subtopic.id} className="subtopic-item">{subtopic.title}</li>
                ))}
              </ul>
              <button
                className="learn-button"
                onClick={() => handleLearnClick(selectedTopic)} // Naudojame ID navigacijos metu
              >
                Pradėti mokytis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default YearTopicPage;
