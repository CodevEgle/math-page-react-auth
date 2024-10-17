import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import BoardAdmin from "./BoardAdmin";
import BoardModerator from "./BoardModerator";
import ProfileComponent from "./ProfileComponent";
import YearsPage from "../learn-components/YearsPage";
import YearTopicPage from "../learn-components/YearTopicPage";
import LearnComponent from "../learn-components/LearnComponent"; // Import LearnComponent
import '../StartComponent.css';

const StartComponent = () => {
  const [showModeratorBoardButton, setShowModeratorBoardButton] = useState(false);
  const [showAdminBoardButton, setShowAdminBoardButton] = useState(false);
  const [currentBoard, setCurrentBoard] = useState("user");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [selectedYear, setSelectedYear] = useState(null); // Tracks the selected year
  const [selectedTopics, setSelectedTopics] = useState(null); // Tracks topics for the selected year
  const [selectedTopic, setSelectedTopic] = useState(null); // Tracks the selected topic for learning
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
    setSelectedYear(year); // Set the selected year
    setSelectedTopics(topics); // Set topics for the selected year
    setSelectedTopic(null); // Ensure no topic is selected yet
  };

  const handleBackToYearsPage = () => {
    setSelectedYear(null); // Reset year to go back to YearsPage
    setSelectedTopics(null); // Reset topics when going back
    setSelectedTopic(null); // Reset topic
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null); // Go back to YearTopicPage without resetting the year
  };

  const handleLearn = (topic) => {
    setSelectedTopic({
      ...topic,
      theories: topic.theories || [], // Ensure theories is an array
      assessment: topic.assessment || '', // Default to empty string if no assessment
    });
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
                Admin Board
              </button>
            </li>
          )}

          {showModeratorBoardButton && (
            <li className="nav-item">
              <button className="btn-link" onClick={handleModeratorBoardClick}>
                Moderator Board
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
            {selectedTopic ? (
              <LearnComponent
                topic={selectedTopic}
                year={selectedYear} // Ensure year is passed
                onBackToTopics={handleBackToTopics} // Navigate back to YearTopicPage
                onBackToYears={handleBackToYearsPage} // Navigate back to YearsPage
              />
              
            ) : selectedYear ? (
              <YearTopicPage
                year={selectedYear}
                topics={selectedTopics}
                onBack={handleBackToYearsPage} // Navigate back to YearsPage
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
