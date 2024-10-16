import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import LearnComponent from './learn-components/LearnComponent';
import ProfileComponent from './components/ProfileComponent';
import HomePage from './components/HomePage'
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import StartComponent from "./components/StartComponent";

const App = () => {
    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/start" element={<StartComponent />} />
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />
                    <Route path="/profile" element={<ProfileComponent />} />
                    <Route path="/learn" element={<LearnComponent />} />
                    <Route path="/user" element={<BoardUser/>} />
                    <Route path="/mod" element={<BoardModerator/>} />
                    <Route path="/admin" element={<BoardAdmin/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;