import React, { useState, useEffect } from 'react';
import '../LearnComponent.css';

function LearnComponent({ topic, year, onBackToTopics, onBackToYears }) {
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState(0);

  const currentTheory = topic.theories[currentTheoryIndex];

  useEffect(() => {
    console.log('Received year in LearnComponent:', year);
  }, [year]);

  const handleNextTheory = () => {
    if (currentTheoryIndex < topic.theories.length - 1) {
      setCurrentTheoryIndex(currentTheoryIndex + 1);
    }
  };

  return (
    <div className="learn-component">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <span className="breadcrumb-item" onClick={onBackToYears} style={{ cursor: 'pointer' }}>
          KLASĖS
        </span>

        {/* Only render separator and year name if year exists */}
        {year && (
          <>
            <span> → </span>
            <span className="breadcrumb-item" onClick={onBackToTopics} style={{ cursor: 'pointer' }}>
              {year.name.toUpperCase()}
            </span>
          </>
        )}

        {/* Always render topic title */}
        <span> → </span>
        <span className="breadcrumb-current">
          {topic.title}
        </span>
      </div>

      {/* Content area for displaying the current theory */}
      <div className="learn-content">
        <h3>{currentTheory.title}</h3>
        <p>{currentTheory.content}</p>

        {currentTheory.exampleExercises.length > 0 && (
          <div>
            <h4>Pavyzdiniai pratimai:</h4>
            <ul>
              {currentTheory.exampleExercises.map((exercise, index) => (
                <li key={index}>{exercise}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="learn-footer">
          {currentTheoryIndex < topic.theories.length - 1 ? (
            <button className="next-button" onClick={handleNextTheory}>
              Next
            </button>
          ) : (
            <button className="assessment-button">Atsiskaitymas</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearnComponent;
