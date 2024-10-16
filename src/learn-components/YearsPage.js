import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopicsPage from './TopicsPage';
import YearsService from '../services/YearsService';  // Import YearsService for API calls
import '../YearsPage.css';

function YearsPage({ onYearSelect }) {
  const [expandedYear, setExpandedYear] = useState(null);
  const [years, setYears] = useState([]);
  const [topicsToShow, setTopicsToShow] = useState(null);

  useEffect(() => {
    // Fetch years from the API using YearsService
    YearsService.getYears()
      .then((response) => {
        setYears(response.data);
        console.log("Fetched years data:", response.data);
      })
      .catch((error) => console.error('Error fetching years:', error));
  }, []);

  const toggleYearDetails = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
    setTopicsToShow(null);
  };

  const handleShowTopics = (topics) => {
    setTopicsToShow(topicsToShow ? null : topics);
  };

  // Instead of navigating, pass the selected year and topics to StartComponent
  const handleStart = (year) => {
    onYearSelect(year.name, year.topics);  // Pass year name and topics to StartComponent
  };

  return (
    <div className="years-page-wrapper">
      <div className="header-buttons">
        <Link to="/" className="back-home-button">Atgal į pradžią</Link>
      </div>

      <div className="years-container">
        <h1 className="years-title">Klasės</h1>
        <p className="years-description">Sveiki prisijungę į matematikos svetainę.</p>
        <p className="years-description">Galite peržiūrėti klasę ir temas, kurias norite mokytis.</p>

        <ul className="years-list">
          {years.map((year, index) => (
            <li key={index} className="year-item">
              <button
                onClick={() => toggleYearDetails(year)}
                className={`year-button ${!year.topics || year.topics.length === 0 ? 'inactive' : 'active'}`}
                disabled={!year.topics || year.topics.length === 0}
              >
                {year.name}
              </button>

              {expandedYear === year && (
                <div className="year-details">
                  <p>{year.description}</p>
                  <button
                    onClick={() => handleShowTopics(year.topics)}
                    className="topics-button"
                  >
                    {topicsToShow ? "Slėpti temas" : "Rodyti temas"}
                  </button>

                  <button className="start-button" onClick={() => handleStart(year)}>
                    Rinktis šią klasę
                  </button>

                  {topicsToShow && <TopicsPage topics={topicsToShow} />}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default YearsPage;
