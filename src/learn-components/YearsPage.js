import React, { useState, useEffect } from 'react';
import TopicsPage from './TopicsPage';
import YearsService from '../services/YearsService';
import '../YearsPage.css';

function YearsPage({ onYearSelect }) {
  const [expandedYear, setExpandedYear] = useState(null);
  const [years, setYears] = useState([]);
  const [topicsToShow, setTopicsToShow] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    YearsService.getYears()
      .then((response) => {
        setYears(response.data);
        console.log("Fetched years data:", response.data);
      })
      .catch((error) => {
        console.error('Error fetching years:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleYearDetails = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
    setTopicsToShow(null);
  };

  const handleShowTopics = (topics) => {
    setTopicsToShow(topicsToShow ? null : topics);
  };

  const handleStart = (year) => {
    onYearSelect(year, year.topics);
  };

  return (
    <div className="years-page-wrapper">
      <div className="years-container">
        <h1 className="years-title">Klasės</h1>
        <p className="years-description">Sveiki prisijungę į matematikos svetainę.</p>
        <p className="years-description">Pasirinkite klasę, kurios kursą norite mokytis.</p>

        {loading ? (
          <p className="loading-message">Loading years...</p>
        ) : (
          <ul className="years-list">
            {years.map((year, index) => {
              if (!year || !year.name) {
                console.warn("Invalid year data:", year);
                return null; // Skip rendering if year data is invalid
              }
              return (
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

                      {topicsToShow && expandedYear === year && <TopicsPage topics={topicsToShow} />}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default YearsPage;
