import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isEmail } from "validator";
import AuthService from "../services/AuthService";
import "../LoginComponent.css"; // Reuse the same CSS file for consistency

const Register = () => {
  const navigate = useNavigate();
  const form = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    if (!username || username.length < 3 || username.length > 20) {
      setMessage("Vartotojo vardas turi būti nuo 3 iki 20 simbolių.");
      return;
    }

    if (!isEmail(email)) {
      setMessage("Netinkamas el. pašto formatas.");
      return;
    }

    if (!password || password.length < 6 || password.length > 40) {
      setMessage("Slaptažodis turi būti nuo 6 iki 40 simbolių.");
      return;
    }

    AuthService.register(username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        navigate("/login"); // Redirect to StartComponent after registration
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="register-page">
      {/* Banner with a button to go back to Home and "Prisijungti" */}
      <div className="register-banner">
        <Link to="/" className="back-to-home-button">
          Grįžti į pradžią
        </Link>
        <Link to="/login" className="btn-link-right">
          Prisijungti
        </Link>
      </div>

      {/* Title for the register page */}
      <h2 className="register-title">Užsiregistruokite ir mokykitės</h2>

      {/* Register form */}
      <div className="register-container">
        <form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label>Vartotojo vardas</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  required
                />
              </div>

              <div className="form-group">
                <label>El. paštas</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Slaptažodis</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  required
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block" type="submit">
                  Registruotis
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={successful ? "alert alert-success" : "alert alert-danger"}
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
