import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import "../LoginComponent.css"; // CSS remains the same

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      navigate("/start");  // Redirect to StartComponent if already logged in
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      () => {
        navigate("/start");  // Redirect to StartComponent after successful login
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="login-page">
      {/* Banner with a button to go back to Home and "Registruoti naują vartotoją" */}
      <div className="login-banner">
        <Link to="/" className="back-to-home-button">
          Grįžti į pradžią
        </Link>
        <Link to="/register" className="btn-link-right">
          Registruoti naują vartotoją
        </Link>
      </div>

      {/* Title for the login page */}
      <h2 className="login-title">Prisijunkite ir mokykitės</h2>

      {/* Login form */}
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Vartotojo vardas</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Slaptažodis</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : "Prisijungti"}
            </button>
          </div>

          {message && <div className="alert alert-danger" role="alert">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
