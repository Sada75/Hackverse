import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";

const contractAddress = "0xa0393b172C532F3B2b0cba1088822579C8659019";

function AllReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractABI, provider);

          const reportCount = await contract.reportCount();

          const reportsData = [];
          for (let i = 1; i <= reportCount; i++) {
            const report = await contract.getReport(i);
            const [reporter, category, description, location, points, upvotes, downvotes, isResolved] = report;
            reportsData.push({
              id: i,
              reporter,
              category,
              description,
              location,
              points,
              upvotes: upvotes.toString(), // Ensure this is converted from BigNumber
              downvotes: downvotes.toString(), // Ensure this is converted from BigNumber
              isResolved,
            });
          }

          setReports(reportsData);
          setLoading(false);
        } else {
          setError("Ethereum provider not found. Please install MetaMask.");
          setLoading(false);
        }
      } catch (err) {
        setError("Error fetching reports: " + err.message);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleUpvote = async (reportId) => {
    try {
      setTransactionLoading(true);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.upvoteReport(reportId);
        await tx.wait();

        // Update the report's upvote count
        setReports(prevReports => {
          return prevReports.map(report => 
            report.id === reportId
              ? { ...report, upvotes: report.upvotes + 1 }
              : report
          );
        });
        setTransactionLoading(false);
      } else {
        setError("Ethereum provider not found.");
        setTransactionLoading(false);
      }
    } catch (err) {
      setError("Error upvoting report: " + err.message);
      setTransactionLoading(false);
    }
  };

  const handleDownvote = async (reportId) => {
    try {
      setTransactionLoading(true);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.downvoteReport(reportId);
        await tx.wait();

        // Update the report's downvote count
        setReports(prevReports => {
          return prevReports.map(report => 
            report.id === reportId
              ? { ...report, downvotes: report.downvotes + 1 }
              : report
          );
        });
        setTransactionLoading(false);
      } else {
        setError("Ethereum provider not found.");
        setTransactionLoading(false);
      }
    } catch (err) {
      setError("Error downvoting report: " + err.message);
      setTransactionLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Community Reports</h1>
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      )}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}
      <div className="dashboard-grid">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="report-form-card">
              <div className="report-header">
                <span className="report-id">Report #{report.id}</span>
                <span className={`status-pill ${report.isResolved ? 'resolved' : 'pending'}`}>
                  {report.isResolved ? "Resolved" : "Pending"}
                </span>
              </div>
              <div className="report-content">
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <p>{report.category}</p>
                </div>
                <div className="input-group">
                  <label className="input-label">Description</label>
                  <p className="report-description">{report.description}</p>
                </div>
                <div className="input-group">
                  <label className="input-label">Location</label>
                  <p className="report-location">{report.location}</p>
                </div>
                <div className="report-stats">
                  <span>Points: {report.points}</span>
                  <span>Upvotes: {report.upvotes}</span>
                  <span>Downvotes: {report.downvotes}</span>
                </div>
              </div>
              <div className="action-buttons">
                <button 
                  className="vote-button"
                  onClick={() => handleUpvote(report.id)} 
                  disabled={transactionLoading || report.isResolved}
                >
                  👍 Upvote
                </button>
                <button 
                  className="vote-button"
                  onClick={() => handleDownvote(report.id)} 
                  disabled={transactionLoading || report.isResolved}
                >
                  👎 Downvote
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reports">
            <p>No reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllReports;
