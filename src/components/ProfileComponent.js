import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import YearsService from "../services/YearsService";

const ProfileComponent = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);

    if (user && user.id) {
      YearsService.getGrades(user.id)
        .then(response => {
          setGrades(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching grades:", err);
          setError("Nepavyko gauti įvertinimų.");
          setLoading(false);
        });
    }
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
            <strong>Rolės:</strong> {currentUser.roles.join(", ")}
          </p>
          <div>
            <strong>Įvertinimai:</strong>
            {loading ? (
              <p>Įvertinimai kraunami...</p>
            ) : error ? (
              <p>{error}</p>
            ) : grades.length > 0 ? (
              <ul>
                {grades.map((grade, index) => (
                  <li key={index}>
                    {`Tema: ${grade.topic.title}, Įvertis: ${grade.score}`}
                  </li>
                ))}
              </ul>
            ) : (
              <span> Nėra įvertinimų.</span>
            )}
          </div>
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
