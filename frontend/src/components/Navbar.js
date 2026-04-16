import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <div className="navbar-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#logoGrad)" />
              <path d="M8 8h12M8 12h8M8 16h10M8 20h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar-title">ResumeAI</span>
        </Link>

        <button
          className="navbar-toggle"
          id="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" id="nav-dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/analyzer" className="nav-link" id="nav-analyzer" onClick={() => setMenuOpen(false)}>
                Analyzer
              </Link>
              <div className="nav-user-section">
                <span className="nav-user-name">{user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary nav-logout-btn" id="nav-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" id="nav-login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary nav-register-btn" id="nav-register" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
