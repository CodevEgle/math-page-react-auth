import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";

const ProfileComponent = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();  // Retrieve current user information
    setCurrentUser(user);
  }, []);

  return (
    <div className="profile-container">
      {currentUser ? (
        <div>
          <h3>Vartotojo Informacija</h3>
          <p>
            <strong>Vartotojo vardas:</strong> {currentUser.username}
          </p>
          <p>
            <strong>El. paštas:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Roles:</strong> {currentUser.roles.join(", ")}
          </p>
        </div>
      ) : (
        <div>
          <p>Nėra vartotojo informacijos.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
