import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TripsPage from './pages/TripsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import Footer from './components/Footer.jsx';
import SearchPage from './pages/SearchPage.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app-wrapper">
        {isAuthenticated && (
          <nav className="nav-bar">
            <div className="logo">🧭🌏Travel Planner</div>
            <div className="nav-links">
              <Link to="/">Главная</Link> |{" "}
              <Link to="/trips">Поездки</Link> |{" "}
              <Link to="/search">Поиск</Link> |{" "}
              <Link to="/profile">Профиль</Link>
            </div>
          </nav>
        )}

        <div className="content">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </div>

        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;
