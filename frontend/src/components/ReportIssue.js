import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder

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
    <div className="report-issue-container">
      <h1>Report Issue or Resolve Report</h1>

      <div className="user-type-selection">
        <button onClick={() => setUserType("user")}>I am a User</button>
      </div>

      {userType === "user" && (
        <div className="report-form">
          <h2>Submit a Report</h2>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={handleSubmitReport}>Submit Report</button>
        </div>
      )}

      <div className="user-reports">
        <h2>Your Reports</h2>
        {userReports.length > 0 ? (
          <ul>
            {userReports.map((report) => (
              <li key={report.id}>
                <p><strong>Category:</strong> {report.category}</p>
                <p><strong>Description:</strong> {report.description}</p>
                <p><strong>Location:</strong> {report.location}</p>
                <p><strong>Upvotes:</strong> {report.upvotes}</p>
                <p><strong>Downvotes:</strong> {report.downvotes}</p>
                <p><strong>Points:</strong> {report.points}</p>
                <p><strong>Resolved:</strong> {report.isResolved ? "Yes" : "No"}</p>
                {!report.isResolved && (
                  <>
                    <button onClick={() => handleUpvote(report.id)}>Upvote</button>
                    <button onClick={() => handleDownvote(report.id)}>Downvote</button>
                    <button onClick={() => handleMarkResolved(report.id)}>
                      Mark as Resolved
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports found.</p>
        )}
      </div>

      <div className="account-info">
        <p>Connected Account: {account}</p>
      </div>
    </div>
  );
};

export default ReportIssue;
