import React, { useState, useEffect } from 'react';
import YearsService from '../services/YearsService';
import '../LearnComponent.css';

function LearnComponent({ topic, year, onBackToTopics, onBackToYears, onAssessment, currentUser }) {
  const [currentTheoryIndex, setCurrentTheoryIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const currentTheory = topic.theories[currentTheoryIndex];

  const handleNextTheory = () => {
    if (currentTheoryIndex < topic.theories.length - 1) {
      setCurrentTheoryIndex(currentTheoryIndex + 1);
    }
  };

  const fetchAssessmentQuestions = async (assessmentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await YearsService.getAssessmentQuestions(assessmentId);
      setQuestions(response.data);
    } catch (err) {
      setError('Error fetching questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentStart = (assessment) => {
    setSelectedAssessment(assessment);
    fetchAssessmentQuestions(assessment.id);
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmit = async () => {
    let correctAnswersCount = 0;

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        correctAnswersCount++;
      }
    });

    const score = (correctAnswersCount / questions.length) * 10;
    alert(`Atsakėte teisingai į ${correctAnswersCount} iš ${questions.length} klausimų. Jūsų pažymis - ${score.toFixed(2)}`);

    const gradeDto = {
      muserId: currentUser.id,
      topicId: topic.id,
      score: score,
    };

    console.log('GradeDto:', gradeDto);

    try {
      const response = await YearsService.submitGrade(gradeDto);
      console.log('Grade submitted successfully', response.data);
    } catch (error) {
      console.error('Error submitting grade:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="learn-component">
      <div className="breadcrumb">
        <span className="breadcrumb-item" onClick={onBackToYears} style={{ cursor: 'pointer' }}>
          KLASĖS
        </span>
        {year && (
          <>
            <span> → </span>
            <span className="breadcrumb-item" onClick={onBackToTopics} style={{ cursor: 'pointer' }}>
              {year.name.toUpperCase()}
            </span>
          </>
        )}
        <span> → </span>
        <span className="breadcrumb-current">
          {topic.title}
        </span>
      </div>

      {selectedAssessment && (
        <div className="assessment-title-container">
          <h4>{selectedAssessment.title}</h4>
        </div>
      )}

      <div className="learn-content">
        {!selectedAssessment && (
          <>
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
          </>
        )}

        <div className="learn-footer">
          {!selectedAssessment && currentTheoryIndex < topic.theories.length - 1 ? (
            <button className="next-button" onClick={handleNextTheory}>
              Next
            </button>
          ) : (
            <>
              {topic.assessments && topic.assessments.length > 0 && !selectedAssessment && (
                <div>
                  <h4>Choose an assessment:</h4>
                  {topic.assessments.map((assessment) => (
                    <button
                      key={assessment.id}
                      className="assessment-button"
                      onClick={() => handleAssessmentStart(assessment)}
                    >
                      {assessment.title}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {loading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p>{error}</p>
        ) : questions.length > 0 && (
          <div className="questions-container">
            <ul className="questions-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {questions.map((question, index) => (
                <li key={question.id} className="question-item">
                  <h5>{index + 1}. {question.question} (Points: {question.points})</h5>
                  <div className="options-container">
                    {question.options.map((option, index) => (
                      <div key={index} className="option-item">
                        <input
                          type="radio"
                          id={`option-${question.id}-${index}`}
                          name={`question-${question.id}`}
                          value={option}
                          checked={selectedAnswers[question.id] === option}
                          onChange={() => handleAnswerChange(question.id, option)}
                        />
                        <label htmlFor={`option-${question.id}-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <button className="submit-button" onClick={handleSubmit}>
              Pateikti
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearnComponent;
