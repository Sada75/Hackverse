// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './components/RoleSelection'; // Import RoleSelection component
import AuthorityDashboard from './components/AuthorityDashboard'; // Import AuthorityDashboard component
import ReportIssue from './components/ReportIssue'; // Import ReportIssue component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        <Route path="/report-issue" element={<ReportIssue />} />
      </Routes>
    </Router>
  );
}

export default App;
