import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopicsPage from './TopicsPage';
import YearsService from '../services/YearsService';  // Import YearsService for API calls
import '../YearsPage.css';

function YearsPage() {
  const [expandedYear, setExpandedYear] = useState(null); // Manage expanded year details
  const [years, setYears] = useState([]); // Store years data
  const [topicsToShow, setTopicsToShow] = useState(null); // Manage topics visibility
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch years using the YearsService (Axios)
    YearsService.getYears()
      .then((response) => setYears(response.data))
      .catch((error) => console.error('Error fetching years:', error));
  }, []);

  const toggleYearDetails = (year) => {
    // Toggle the visibility of year details
    setExpandedYear(expandedYear === year ? null : year);
    setTopicsToShow(null); // Hide topics when switching between years
  };

  const handleShowTopics = (topics) => {
    // Toggle the visibility of topics
    setTopicsToShow(topicsToShow ? null : topics);
  };

  const handleStart = (year) => {
    // Navigate to the YearTopicPage with the year's topics
    navigate(`/year/${year.name.replace(" klasė", "klase")}`, { state: { topics: year.topics } });
  };

  return (
    <div className="years-page-wrapper">
      <div className="header-buttons">
        <Link to="/" className="back-home-button">Atgal į pradžią</Link>
        {/* Removed the "Vartotojo Informacija" button */}
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

              {/* Show year details if the year is expanded */}
              {expandedYear === year && (
                <div className="year-details">
                  <p>{year.description}</p>
                  <button
                    onClick={() => handleShowTopics(year.topics)}
                    className="topics-button"
                  >
                    {topicsToShow ? "Slėpti temas" : "Rodyti temas"}
                  </button>

                  {/* Start button to select the year */}
                  <button className="start-button" onClick={() => handleStart(year)}>Rinktis šią klasę</button>

                  {/* Show topics if topicsToShow is not null */}
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
