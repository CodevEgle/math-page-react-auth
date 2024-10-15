import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import BoardAdmin from "./BoardAdmin";
import BoardModerator from "./BoardModerator";
import ProfileComponent from "./ProfileComponent";
import YearsPage from "./YearsPage";
import '../StartComponent.css';  // Import the scoped CSS

const StartComponent = () => {
  const [showModeratorBoardButton, setShowModeratorBoardButton] = useState(false);
  const [showAdminBoardButton, setShowAdminBoardButton] = useState(false);
  const [currentBoard, setCurrentBoard] = useState("user");
  const [currentUser, setCurrentUser] = useState(undefined);
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

  return (
    <div>
      {/* StartComponent header styled similarly to homepage */}
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

      {/* Render the selected board or profile */}
      <div className="start-container">
        {currentBoard === "profile" && <ProfileComponent />}
        {currentBoard === "admin" && <BoardAdmin />}
        {currentBoard === "moderator" && <BoardModerator />}
        {currentBoard === "user" && (
          <>
            <YearsPage />
          </>
        )}
      </div>
    </div>
  );
};

export default StartComponent;
