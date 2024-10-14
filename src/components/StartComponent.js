import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import BoardAdmin from "./BoardAdmin";
import BoardModerator from "./BoardModerator";
import BoardUser from "./BoardUser";
import ProfileComponent from "./ProfileComponent";  // Import ProfileComponent
import YearsPage from "./YearsPage";  // Import YearsPage
import '../StartComponent.css';  // Import the scoped CSS

const StartComponent = () => {
  const [showModeratorBoardButton, setShowModeratorBoardButton] = useState(true); // Show Moderator button for testing
  const [showAdminBoardButton, setShowAdminBoardButton] = useState(true); // Show Admin button for testing
  const [currentBoard, setCurrentBoard] = useState("user"); // Tracks the current board being displayed ("user", "admin", "moderator", or "profile")
  const [currentUser, setCurrentUser] = useState(undefined); // Stores the current user data
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.roles) {
      console.log('User roles:', user.roles);  // Log the user roles for debugging
      setCurrentUser(user);
      setShowAdminBoardButton(user.roles.includes("ROLE_ADMIN")); // Set the admin button visibility
      setShowModeratorBoardButton(user.roles.includes("ROLE_MODERATOR")); // Set the moderator button visibility
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setCurrentBoard("profile");  // Display the ProfileComponent in the body
  };

  const handleAdminBoardClick = () => {
    setCurrentBoard("admin");  // Display the Admin Board in the body
  };

  const handleModeratorBoardClick = () => {
    setCurrentBoard("moderator");  // Display the Moderator Board in the body
  };

  const handleUserBoardClick = () => {
    setCurrentBoard("user");  // Display the User Board in the body
  };

  return (
    <div>
      {/* StartComponent header styled similarly to homepage */}
      <header className="start-header">  {/* Apply the .start-header class */}
        <Link to={"/"} className="start-navbar-brand">Home</Link>

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
              Vartotojo Informacija
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
        {currentBoard === "profile" && <ProfileComponent />}  {/* Show profile if "Vartotojo Informacija" is clicked */}
        {currentBoard === "admin" && <BoardAdmin />}  {/* Show admin board if "Admin Board" is clicked */}
        {currentBoard === "moderator" && <BoardModerator />}  {/* Show moderator board if "Moderator Board" is clicked */}
        {currentBoard === "user" && (
          <>
            <YearsPage />  {/* Show years page after the user board */}
          </>
        )}
      </div>
    </div>
  );
};

export default StartComponent;
