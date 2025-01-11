import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
<<<<<<< HEAD
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder

const contractAddress = "0xa0393b172c532f3b2b0cba1088822579c8659019"; // Smart contract address

function Reports() {
=======
import { contractABI } from "../utils/contractABI";

const contractAddress = "0xa0393b172C532F3B2b0cba1088822579C8659019";

function AllReports() {
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
<<<<<<< HEAD
        // Connect to the Ethereum provider
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractABI, provider);

          // Fetch the total number of reports
          const reportCount = await contract.reportCount();

          // Fetch all reports
          const reportsData = [];
          for (let i = 1; i <= reportCount; i++) {
            const report = await contract.getReport(i);
            reportsData.push(report);
          }

          // Set the fetched reports to state
=======
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

>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
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

<<<<<<< HEAD
  // Function to handle upvoting
=======
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
  const handleUpvote = async (reportId) => {
    try {
      setTransactionLoading(true);

      if (window.ethereum) {
<<<<<<< HEAD
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.upvoteReport(reportId);
        await tx.wait(); // Wait for the transaction to be mined

        // After successful upvote, update the reports state to reflect the new vote count
        const updatedReports = [...reports];
        const updatedReport = { ...updatedReports[reportId - 1], upvotes: updatedReports[reportId - 1].upvotes + 1 };
        updatedReports[reportId - 1] = updatedReport;

        setReports(updatedReports);
=======
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
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
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

<<<<<<< HEAD
  // Function to handle downvoting
=======
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
  const handleDownvote = async (reportId) => {
    try {
      setTransactionLoading(true);

      if (window.ethereum) {
<<<<<<< HEAD
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const tx = await contract.downvoteReport(reportId);
        await tx.wait(); // Wait for the transaction to be mined

        // After successful downvote, update the reports state to reflect the new vote count
        const updatedReports = [...reports];
        const updatedReport = { ...updatedReports[reportId - 1], downvotes: updatedReports[reportId - 1].downvotes + 1 };
        updatedReports[reportId - 1] = updatedReport;

        setReports(updatedReports);
=======
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
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
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
<<<<<<< HEAD
    <div>
      <h1>Reports</h1>
      {loading && <p>Loading reports...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {reports.length > 0 ? (
          reports.map((report, index) => (
            <div key={index} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc" }}>
              <h3>Report {report[0]}</h3>
              <p><strong>Reporter:</strong> {report[0]}</p>
              <p><strong>Category:</strong> {report[1]}</p>
              <p><strong>Description:</strong> {report[2]}</p>
              <p><strong>Location:</strong> {report[3]}</p>
              <p><strong>Points:</strong> {report[4]}</p>
              <p><strong>Upvotes:</strong> {report[5]}</p>
              <p><strong>Downvotes:</strong> {report[6]}</p>
              <p><strong>Resolved:</strong> {report[7] ? "Yes" : "No"}</p>

              <div style={{ marginTop: "10px" }}>
                <button onClick={() => handleUpvote(report[0])} disabled={transactionLoading || report[7]}>
                  Upvote
                </button>
                <button onClick={() => handleDownvote(report[0])} disabled={transactionLoading || report[7]}>
                  Downvote
=======
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
                  {/* <span>Points: {report.points}</span> */}
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
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
                </button>
              </div>
            </div>
          ))
        ) : (
<<<<<<< HEAD
          <p>No reports found.</p>
=======
          <div className="no-reports">
            <p>No reports found.</p>
          </div>
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
        )}
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default Reports;
=======
export default AllReports;
>>>>>>> 59e5f9c354f40d3d99348f93ab2e1ff25fab0fc4
