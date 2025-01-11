import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/shared.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-text">CivicGuard</span>
          <span className="logo-dot">.</span>
        </div>
        <nav className="nav-links">
          <button 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${location.pathname === '/report-issue' ? 'active' : ''}`}
            onClick={() => navigate('/report-issue')}
          >
            Report Issue
          </button>
          <button 
            className={`nav-link ${location.pathname === '/allreports' ? 'active' : ''}`}
            onClick={() => navigate('/allreports')}
          >
            All Reports
          </button>
          <button 
            className={`nav-link ${location.pathname === '/authority-dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/authority-dashboard')}
          >
            Authority Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 