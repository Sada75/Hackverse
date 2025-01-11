// src/components/RoleSelection.js

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const RoleSelection = () => {
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleAuthorityClick = () => {
    navigate('/authority-dashboard'); // Navigate to authority dashboard
  };

  const handleUserClick = () => {
    navigate('/report-issue'); // Navigate to report issue page
  };

  return (
    <div className="role-selection-container">
      <h2>Welcome! Please choose your role:</h2>
      <button onClick={handleAuthorityClick}>I am an Authority</button>
      <button onClick={handleUserClick}>I am a User</button>
    </div>
  );
};

export default RoleSelection;
