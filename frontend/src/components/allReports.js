import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";

const contractAddress = "0xa0393b172c532f3b2b0cba1088822579c8659019";

function Reports() {
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
            reportsData.push(report);
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

        const updatedReports = [...reports];
        const updatedReport = { ...updatedReports[reportId - 1], upvotes: updatedReports[reportId - 1].upvotes + 1 };
        updatedReports[reportId - 1] = updatedReport;

        setReports(updatedReports);
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

        const updatedReports = [...reports];
        const updatedReport = { ...updatedReports[reportId - 1], downvotes: updatedReports[reportId - 1].downvotes + 1 };
        updatedReports[reportId - 1] = updatedReport;

        setReports(updatedReports);
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
          reports.map((report, index) => (
            <div key={index} className="report-form-card">
              <div className="report-header">
                <span className="report-id">Report #{report[0].toString()}</span>
                <span className={`status-pill ${report[7] ? 'resolved' : 'pending'}`}>
                  {report[7] ? "Resolved" : "Pending"}
                </span>
              </div>
              <div className="report-content">
                <div className="input-group">
                  <label className="input-label">Category</label>
                  <p>{report[1]}</p>
                </div>
                <div className="input-group">
                  <label className="input-label">Description</label>
                  <p className="report-description">{report[2]}</p>
                </div>
                <div className="input-group">
                  <label className="input-label">Location</label>
                  <p className="report-location">{report[3]}</p>
                </div>
                <div className="report-stats">
                  <span>Points: {report[4].toString()}</span>
                  <span>Upvotes: {report[5].toString()}</span>
                  <span>Downvotes: {report[6].toString()}</span>
                </div>
              </div>
              <div className="action-buttons">
                <button 
                  className="vote-button"
                  onClick={() => handleUpvote(report[0])} 
                  disabled={transactionLoading || report[7]}
                >
                  👍 Upvote
                </button>
                <button 
                  className="vote-button"
                  onClick={() => handleDownvote(report[0])} 
                  disabled={transactionLoading || report[7]}
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

export default Reports;
