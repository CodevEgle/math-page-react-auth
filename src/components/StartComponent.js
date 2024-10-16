import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import BoardAdmin from "./BoardAdmin";
import BoardModerator from "./BoardModerator";
import ProfileComponent from "./ProfileComponent";  // Import ProfileComponent
import YearsPage from "../learn-components/YearsPage";  // Import YearsPage
import YearTopicPage from "../learn-components/YearTopicPage";  // Import YearsTopicPage for selected year
import '../StartComponent.css';  // Import the scoped CSS

const StartComponent = () => {
  const [showModeratorBoardButton, setShowModeratorBoardButton] = useState(false);
  const [showAdminBoardButton, setShowAdminBoardButton] = useState(false);
  const [currentBoard, setCurrentBoard] = useState("user");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [selectedYear, setSelectedYear] = useState(null);  // New state to track the selected year
  const [selectedTopics, setSelectedTopics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.roles) {
      console.log('User roles:', user.roles);
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
  };

  const handleBackToYears = () => {
    setSelectedYear(null);  
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
            {selectedYear ? (
              <YearTopicPage year={selectedYear} topics={selectedTopics} onBack={handleBackToYears} />
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
