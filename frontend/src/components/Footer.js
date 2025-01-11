import React from 'react';
import '../styles/shared.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CivicGuard</h3>
          <p>Empowering communities through blockchain-based civic engagement.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Report an Issue</li>
            <li>View Reports</li>
            <li>Authority Dashboard</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li>Twitter</li>
            <li>Discord</li>
            <li>GitHub</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 CivicGuard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 