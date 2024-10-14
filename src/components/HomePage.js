import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../HomePage.css';

function HomePage() {
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  const handleSignIn = () => {
    const user = AuthService.getCurrentUser();  // Check if user is already logged in
    if (user) {
      navigate('/start');  // If logged in, redirect to StartComponent
    } else {
      navigate('/login');  // If not logged in, go to login page
    }
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="homepage-container">
      {/* Header with banner */}
      <header className="homepage-header">
        <div className="banner-container">
          <div className="banner">
            <span className="main-title">matieka.lt</span>
            <span className="sub-title">Savarankiško matematikos mokymosi puslapis</span>
          </div>
        </div>
      </header>

      {/* Body with buttons */}
      <main className="homepage-content">
        <button className="about-button" onClick={toggleAbout}>
          Apie
        </button>
        {showAbout && (
          <div className="about-content">
            <p>Čia galite sužinoti daugiau apie savarankiško matematikos mokymosi svetainę.</p>
          </div>
        )}

        <div className="auth-buttons">
          <button className="signin-button" onClick={handleSignIn}>
            Prisijungti
          </button>
          <button className="signup-button" onClick={handleSignUp}>
            Užsiregistruoti
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>© 2024 matieka.lt. Visos teisės saugomos.</p>
      </footer>
    </div>
  );
}

export default HomePage;
