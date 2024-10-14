import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import BoardAdmin from "./BoardAdmin";
import BoardModerator from "./BoardModerator";
import BoardUser from "./BoardUser";
import ProfileComponent from "./ProfileComponent";  // Import ProfileComponent
import YearsPage from "./YearsPage";  // Import YearsPage

const StartComponent = () => {
  const [showModeratorBoardButton, setShowModeratorBoardButton] = useState(false); // Controls display of the moderator board button
  const [showAdminBoardButton, setShowAdminBoardButton] = useState(false); // Controls display of the admin board button
  const [currentBoard, setCurrentBoard] = useState("user"); // Tracks the current board being displayed ("user", "admin", "moderator", or "profile")
  const [currentUser, setCurrentUser] = useState(undefined); // Stores the current user data
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
      {/* Navbar with Home, Admin, Moderator, Profile, and Logout buttons */}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav mr-auto">
          <Link to={"/"} className="navbar-brand">Home</Link>

          {showAdminBoardButton && (
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleAdminBoardClick}>
                Admin Board
              </button>
            </li>
          )}

          {showModeratorBoardButton && (
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleModeratorBoardClick}>
                Moderator Board
              </button>
            </li>
          )}
        </div>

        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-link nav-link" onClick={handleProfileClick}>
              Vartotojo Informacija
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" onClick={logOut}>
              Atsijungti
            </button>
          </li>
        </div>
      </nav>

      {/* Render the selected board or profile */}
      <div className="container mt-3">
        {currentBoard === "profile" && <ProfileComponent />}  {/* Show profile if "Vartotojo Informacija" is clicked */}
        {currentBoard === "admin" && <BoardAdmin />}  {/* Show admin board if "Admin Board" is clicked */}
        {currentBoard === "moderator" && <BoardModerator />}  {/* Show moderator board if "Moderator Board" is clicked */}
        {currentBoard === "user" && (
          <>
            <BoardUser />  {/* Show user board by default or if "User Board" is clicked */}
            <YearsPage />  {/* Show years page after the user board */}
          </>
        )}
      </div>
    </div>
  );
};

export default StartComponent;
