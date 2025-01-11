import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder
import '../styles/shared.css';
import Header from "./Header";
import Footer from "./Footer";

const contractAddress = "0xa0393b172c532f3b2b0cba1088822579c8659019"; // Replace with your deployed contract address

const ReportIssue = () => {
  const [userType, setUserType] = useState(""); // 'authority' or 'user'
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userReports, setUserReports] = useState([]); // Store user's reports

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        // Create a new BrowserProvider for ethers.js v6
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);

        // Request account access
        const accounts = await _provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        // Create a contract instance
        const signer = await _provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(_contract);

        // Fetch user reports
        fetchUserReports(_contract, accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    };
    initialize();
  }, []);

  const fetchUserReports = async (contract, userAddress) => {
    try {
      const reports = [];
      const totalReports = await contract.reportCount(); // Get the total number of reports
      for (let i = 1; i <= totalReports; i++) {
        const report = await contract.getReport(i);
        if (report[0].toLowerCase() === userAddress.toLowerCase()) {
          reports.push({
            id: i,
            reporter: report[0],
            category: report[1],
            description: report[2],
            location: report[3],
            points: report[4].toString(),
            upvotes: report[5].toString(),
            downvotes: report[6].toString(),
            isResolved: report[7],
          });
        }
      }
      setUserReports(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleSubmitReport = async () => {
    if (category && description && location) {
      try {
        const tx = await contract.submitReport(category, description, location);
        await tx.wait();
        alert("Report submitted successfully!");
        setCategory("");
        setDescription("");
        setLocation("");

        // Refresh the user's reports
        fetchUserReports(contract, account);
      } catch (error) {
        console.error("Error submitting report:", error);
        alert("Failed to submit report.");
      }
    } else {
      alert("Please provide category, description, and location.");
    }
  };

  const handleUpvote = async (reportId) => {
    try {
      const tx = await contract.upvoteReport(reportId);
      await tx.wait();
      alert("Report upvoted successfully!");

      // Refresh the user's reports
      fetchUserReports(contract, account);
    } catch (error) {
      console.error("Error upvoting report:", error);
      alert("Failed to upvote the report.");
    }
  };

  const handleDownvote = async (reportId) => {
    try {
      const tx = await contract.downvoteReport(reportId);
      await tx.wait();
      alert("Report downvoted successfully!");

      // Refresh the user's reports
      fetchUserReports(contract, account);
    } catch (error) {
      console.error("Error downvoting report:", error);
      alert("Failed to downvote the report.");
    }
  };

  const handleMarkResolved = async (reportId) => {
    try {
      const tx = await contract.markReportAsResolved(reportId);
      await tx.wait();
      alert("Report marked as resolved successfully!");
      // Refresh the user's reports
      fetchUserReports(contract, account);
    } catch (error) {
      console.error("Error marking report as resolved:", error);
      alert("Failed to mark report as resolved.");
    }
  };

  return (
    <div className="page-container">
      <Header />
      
      <main className="gradient-bg main-content">
        <div className="dashboard-container">
          <h1 className="page-title">Report an Issue</h1>
          
          <div className="report-form-card">
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Category</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g., Infrastructure, Safety, Environment"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field"
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: '120px' }}
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">Location</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Enter the location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <button className="button-primary" onClick={handleSubmitReport}>
                Submit Report
              </button>
            </div>
          </div>

          <h2 className="section-title">Your Reports</h2>
          <div className="dashboard-grid">
            {userReports.map((report) => (
              <div key={report.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span className="status-pill pending">Report #{report.id}</span>
                  <span className={`status-pill ${report.isResolved ? 'resolved' : 'pending'}`}>
                    {report.isResolved ? '✓ Resolved' : '⚠ Pending'}
                  </span>
                </div>
                
                <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>{report.category}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{report.description}</p>
                <p style={{ color: 'var(--text-secondary)' }}>📍 {report.location}</p>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  marginTop: '1rem',
                  padding: '1rem 0',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <button onClick={() => handleUpvote(report.id)} className="vote-button">
                    👍 {report.upvotes}
                  </button>
                  <button onClick={() => handleDownvote(report.id)} className="vote-button">
                    👎 {report.downvotes}
                  </button>
                  {/* <span>🏆 {report.points} pts</span> */}
                </div>
                
                {!report.isResolved && (
                  <button 
                    className="button-primary" 
                    onClick={() => handleMarkResolved(report.id)}
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportIssue;