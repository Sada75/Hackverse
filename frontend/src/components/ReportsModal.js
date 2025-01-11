import React from 'react';
import '../styles/shared.css';

const ReportsModal = ({ isOpen, onClose, reports }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>All Reports</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report.id} className="report-card card">
                <div className="report-header">
                  <span className="report-id">#{report.id}</span>
                  <span className={`status-badge ${report.isResolved ? 'resolved' : 'pending'}`}>
                    {report.isResolved ? '✓ Resolved' : '⚠ Pending'}
                  </span>
                </div>
                <h3>{report.category}</h3>
                <p className="report-description">{report.description}</p>
                <p className="report-location">📍 {report.location}</p>
                <div className="report-stats">
                  <span>👍 {report.upvotes}</span>
                  <span>👎 {report.downvotes}</span>
                  {/* <span>🏆 {report.points} pts</span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal; 