import React, { useState, useEffect } from "react";
import YearsService from "../services/YearsService";
import "../BoardAdmin.css";

const BoardModerator = () => {
  const [showLearningContent, setShowLearningContent] = useState(false);
  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [error, setError] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [addingNewYear, setAddingNewYear] = useState(false);
  const [yearName, setYearName] = useState("");
  const [yearDescription, setYearDescription] = useState("");

  const handleLearningContentClick = () => {
    setShowLearningContent(!showLearningContent);
    if (!showLearningContent) {
      fetchYears();
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
      topics: [], // Leaving topics empty as specified
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
      topics: [],
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
        <h3>Moderator Board</h3>
        <p>Čia rodomas tik moderatoriams prieinamas turinys</p>
        <div className="moderator-buttons" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button
            className="styled-button"
            onClick={handleLearningContentClick}
            style={{ marginBottom: "10px" }}
          >
            Redaguoti klases
          </button>

          <button
            className="styled-button"
            style={{ marginBottom: "10px", backgroundColor: "grey", cursor: "not-allowed" }}
            disabled
          >
            Redaguoti temas
          </button>

          <button
            className="styled-button"
            style={{ backgroundColor: "grey", cursor: "not-allowed" }}
            disabled
          >
            Redaguoti atsiskaitymus
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
                        <td>{year.topics.map(topic => topic.title).join(", ")}</td>
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

export default BoardModerator;
