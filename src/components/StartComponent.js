import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import BoardAdmin from "./BoardAdmin";
import BoardModerator from "./BoardModerator";
import ProfileComponent from "./ProfileComponent";
import YearsPage from "../learn-components/YearsPage";
import YearTopicPage from "../learn-components/YearTopicPage";
import LearnComponent from "../learn-components/LearnComponent";
import AssessmentComponent from "../learn-components/AssessmentComponent";
import ErrorBoundary from "../ErrorBoundary";
import '../StartComponent.css';

const StartComponent = () => {
  const [showModeratorBoardButton, setShowModeratorBoardButton] = useState(false);
  const [showAdminBoardButton, setShowAdminBoardButton] = useState(false);
  const [currentBoard, setCurrentBoard] = useState("user");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.roles) {
      setCurrentUser(user);
      setShowAdminBoardButton(user.roles.includes("ROLE_ADMIN"));
      setShowModeratorBoardButton(user.roles.includes("ROLE_MODERATOR"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setCurrentBoard("profile");
  };

  const handleAdminBoardClick = () => {
    setCurrentBoard("admin");
  };

  const handleModeratorBoardClick = () => {
    setCurrentBoard("moderator");
  };

  const handleUserBoardClick = () => {
    setCurrentBoard("user");
  };

  const handleYearSelect = (year, topics) => {
    setSelectedYear(year);
    setSelectedTopics(topics);
    setSelectedTopic(null);
    setSelectedAssessment(null);
  };

  const handleBackToYearsPage = () => {
    setSelectedYear(null);
    setSelectedTopics(null);
    setSelectedTopic(null);
    setSelectedAssessment(null);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedAssessment(null);
  };

  const handleLearn = (topic) => {
    setSelectedTopic({
      ...topic,
      theories: topic.theories || [], 
      assessments: topic.assessments || [], 
    });
    setSelectedAssessment(null);
  };

  return (
    <div>
      <header className="start-header">
        <Link to={"/"} className="start-navbar-brand">Į pradžią</Link>

        {currentBoard !== "user" && (
          <button className="btn-link start-back-button" onClick={handleUserBoardClick}>
            Atgal į mokslus
          </button>
        )}

        <div className="start-navbar-nav">
          {showAdminBoardButton && (
            <li className="nav-item">
              <button className="btn-link" onClick={handleAdminBoardClick}>
                Administratorius
              </button>
            </li>
          )}

          {showModeratorBoardButton && (
            <li className="nav-item">
              <button className="btn-link" onClick={handleModeratorBoardClick}>
                Moderatorius
              </button>
            </li>
          )}

          <li className="nav-item">
            <button className="btn-link" onClick={handleProfileClick}>
              {currentUser ? `${currentUser.username} nustatymai` : "Vartotojo informacija"}
            </button>
          </li>

          <li className="nav-item">
            <button className="btn-link" onClick={logOut}>
              Atsijungti
            </button>
          </li>
        </div>
      </header>

      <div className="start-container">
        {currentBoard === "profile" && <ProfileComponent />}
        {currentBoard === "admin" && <BoardAdmin />}
        {currentBoard === "moderator" && <BoardModerator />}
        {currentBoard === "user" && (
          <>
            {selectedAssessment ? (
              <ErrorBoundary>
                <AssessmentComponent
                  assessment={selectedAssessment}
                  onBackToTopics={handleBackToTopics}
                  onBackToYears={handleBackToYearsPage}
                />
              </ErrorBoundary>
            ) : selectedTopic ? (
              <LearnComponent
                topic={selectedTopic}
                year={selectedYear}
                onBackToTopics={handleBackToTopics}
                onBackToYears={handleBackToYearsPage}
                onAssessment={setSelectedAssessment}
                currentUser={currentUser}
              />
            ) : selectedYear ? (
              <YearTopicPage
                year={selectedYear}
                topics={selectedTopics}
                onBack={handleBackToYearsPage}
                onLearn={handleLearn}
              />
            ) : (
              <YearsPage onYearSelect={handleYearSelect} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StartComponent;
