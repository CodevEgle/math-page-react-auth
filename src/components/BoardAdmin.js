import React, { useState, useEffect } from "react";
import UserService from "../services/UserService";
import YearsService from "../services/YearsService";
import authHeader from "../services/authHeader";
import "../BoardAdmin.css";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [showLearningContent, setShowLearningContent] = useState(false);
  const [users, setUsers] = useState([]);
  const [years, setYears] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [error, setError] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [addingNewYear, setAddingNewYear] = useState(false);
  const [yearName, setYearName] = useState("");
  const [yearDescription, setYearDescription] = useState("");
  const [currentUser, setCurrentUser] = useState(() => {
    const header = authHeader();
    if (header) {
      return JSON.parse(localStorage.getItem("user"));
    } else {
      return null;
    }
  });
  const availableRoles = ["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"];

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  const handleUsersClick = () => {
    setShowUsers(!showUsers);
    setShowLearningContent(false);
    if (!showUsers) {
      fetchUsers();
    }
  };

  const handleLearningContentClick = () => {
    setShowLearningContent(!showLearningContent);
    setShowUsers(false);
    if (!showLearningContent) {
      fetchYears();
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await UserService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Error fetching users.");
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchYears = async () => {
    setLoadingYears(true);
    setError(null);
    try {
      const response = await YearsService.getYears();
      setYears(response.data);
    } catch (err) {
      setError("Error fetching years.");
      console.error("Error fetching years:", err);
    } finally {
      setLoadingYears(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Ar tikrai norite ištrinti šį vartotoją?")) {
      try {
        await UserService.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
        alert("Vartotojas sėkmingai ištrintas.");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Nepavyko ištrinti vartotojo.");
      }
    }
  };

  const handleUpdateUser = (user) => {
    setUpdatingUser(user);
  };

  const handleAddRole = async (userId, role) => {
    if (!availableRoles.includes(role)) {
      alert("Neteisinga rolė.");
      return;
    }

    const user = users.find((u) => u.id === userId);
    if (user && user.roles.some((r) => r.name === role)) {
      alert("Vartotojas jau turi šią rolę.");
      return;
    }

    try {
      await UserService.addRoleToUser(userId, role);
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, roles: [...user.roles, { name: role }] } : user
      );
      setUsers(updatedUsers);
      alert(`Rolė ${role} sėkmingai pridėta.`);
    } catch (err) {
      console.error("Error adding role:", err);
      alert("Nepavyko pridėti rolės.");
    }
  };

  const handleDeleteRole = async (userId, role) => {
    if (currentUser.id === userId && role === "ROLE_ADMIN") {
      alert("Negalite pašalinti savo administratoriaus rolės.");
      return;
    }

    try {
      await UserService.deleteRoleFromUser(userId, role);
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, roles: user.roles.filter((r) => r.name !== role) } : user
      );
      setUsers(updatedUsers);
      alert(`Rolė ${role} sėkmingai pašalinta.`);
    } catch (err) {
      console.error("Error deleting role:", err);
      alert("Nepavyko pašalinti rolės.");
    }
  };

  const handleAddYearClick = () => {
    setAddingNewYear(true);
    setShowLearningContent(false);
    setEditingYear(null);
    setYearName("");
    setYearDescription("");
  };

  const handleSaveNewYear = async () => {
    const newYear = {
      name: yearName,
      description: yearDescription,
      topics: [],
    };

    try {
      await YearsService.createYear(newYear);
      setYears([...years, newYear]);
      alert("Metai sėkmingai pridėti.");
      setAddingNewYear(false);
    } catch (err) {
      console.error("Error creating year:", err);
      alert("Nepavyko pridėti metų.");
    }
  };

  const handleCancelAddYear = () => {
    setAddingNewYear(false);
    setShowLearningContent(true);
  };

  const handleDeleteYear = async (yearId) => {
    if (window.confirm("Ar tikrai norite ištrinti šiuos metus?")) {
      try {
        await YearsService.deleteYear(yearId);
        setYears(years.filter((year) => year.id !== yearId));
        alert("Metai sėkmingai ištrinti.");
      } catch (err) {
        console.error("Error deleting year:", err);
        alert("Nepavyko ištrinti metų.");
      }
    }
  };

  const handleEditYearClick = (year) => {
    setEditingYear(year);
    setYearName(year.name);
    setYearDescription(year.description);
    setShowLearningContent(false);
    setAddingNewYear(false);
  };

  const handleSaveYear = async () => {
    if (!editingYear) return;

    const updatedYear = {
      name: yearName,
      description: yearDescription,
      topics: editingYear.topics, // Keep the existing topics
    };

    try {
      await YearsService.editYear(editingYear.id, updatedYear);
      setYears(
        years.map((year) =>
          year.id === editingYear.id ? { ...year, ...updatedYear } : year
        )
      );
      alert("Metai sėkmingai pakeisti.");
      setEditingYear(null);
      setShowLearningContent(true);
    } catch (err) {
      console.error("Error editing year:", err);
      alert("Nepavyko pakeisti metų.");
    }
  };

  const handleCancelEdit = () => {
    setEditingYear(null);
    setShowLearningContent(true);
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
        <p>Čia rodomas tik administratoriui prieinamas turinys</p>
        <div className="admin-buttons" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button
            className="styled-button"
            style={{ marginBottom: "10px" }}
            onClick={handleUsersClick}
          >
            Vartotojai
          </button>

          {showUsers && (
            <div className="users-table-wrapper">
              {loadingUsers ? (
                <p>Kraunama...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vartotojo vardas</th>
                      <th>El. paštas</th>
                      <th>Rolės</th>
                      <th>Įvertinimai</th>
                      <th>Veiksmai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.roles.map((role) => role.name).join(", ")}</td>
                        <td>{user.grades.map((grade) => grade.score).join(", ")}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            style={{ marginRight: "5px" }}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Ištrinti
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleUpdateUser(user)}
                          >
                            Atnaujinti
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {updatingUser && (
                <div className="update-form" style={{ marginTop: "20px" }}>
                  <h4>Atnaujinti vartotoją: {updatingUser.username}</h4>
                  <div>
                    {updatingUser.roles.map((role) => (
                      (role.name !== "ROLE_USER" &&
                        !(currentUser.id === updatingUser.id && role.name === "ROLE_ADMIN")) && (
                          <button
                            key={role.name}
                            className="btn btn-danger"
                            style={{ margin: "5px" }}
                            onClick={() => handleDeleteRole(updatingUser.id, role.name)}
                          >
                            Pašalinti rolę: {role.name}
                          </button>
                        )
                    ))}

                    {availableRoles
                      .filter((role) => !updatingUser.roles.some((r) => r.name === role))
                      .map((role) => (
                        <button
                          key={role}
                          className="btn btn-success"
                          style={{ margin: "5px" }}
                          onClick={() => handleAddRole(updatingUser.id, role)}
                        >
                          Pridėti rolę: {role}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className="styled-button"
            onClick={handleLearningContentClick}
            style={{ marginTop: "10px" }}
          >
            Mokymosi turinys
          </button>

          {showLearningContent && !editingYear && !addingNewYear && (
            <div className="learning-content-table-wrapper" style={{ backgroundColor: "white", padding: "20px", borderRadius: "5px", marginTop: "20px" }}>
              {loadingYears ? (
                <p>Kraunama...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Metai</th>
                      <th>Aprašymas</th>
                      <th>Temos</th>
                      <th>Veiksmai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map((year) => (
                      <tr key={year.id}>
                        <td>{year.name}</td>
                        <td>{year.description}</td>
                        <td>{year.topics.map((topic) => topic.title).join(", ")}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteYear(year.id)}
                          >
                            Ištrinti
                          </button>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEditYearClick(year)}
                          >
                            Pakeisti
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                className="styled-button"
                style={{ marginTop: "20px" }}
                onClick={handleAddYearClick}
              >
                Pridėti naują klasę
              </button>
            </div>
          )}

          {(addingNewYear || editingYear) && (
            <div className="edit-year-form" style={{ marginTop: "20px", backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
              <h4>{addingNewYear ? "Pridėti naują klasę" : `Pakeisti metus: ${editingYear.name}`}</h4>
              <div>
                <label>Metų pavadinimas:</label>
                <input
                  type="text"
                  value={yearName}
                  onChange={(e) => setYearName(e.target.value)}
                />
              </div>
              <div>
                <label>Aprašymas:</label>
                <textarea
                  value={yearDescription}
                  onChange={(e) => setYearDescription(e.target.value)}
                />
              </div>
              <button
                className="btn btn-success"
                onClick={addingNewYear ? handleSaveNewYear : handleSaveYear}
                style={{ marginTop: "10px" }}
              >
                {addingNewYear ? "Pridėti" : "Išsaugoti"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={addingNewYear ? handleCancelAddYear : handleCancelEdit}
                style={{ marginTop: "10px", marginLeft: "10px" }}
              >
                Atšaukti
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default BoardAdmin;
