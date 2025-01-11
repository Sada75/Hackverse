import React, { useState, useEffect } from "react"; 
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder

const contractAddress = "0xa0393b172c532f3b2b0cba1088822579c8659019"; // Replace with your deployed contract address

const ReportIssue = () => {
  const [userType, setUserType] = useState(""); // 'authority' or 'user'
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(""); // New state for location
  const [points, setPoints] = useState(0);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [reportId, setReportId] = useState("");
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

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
      } else {
        alert("Please install MetaMask!");
      }
    };
    initialize();
  }, []);

  const handleSubmitReport = async () => {
    if (category && description && location) { // Validate if location is provided
      try {
        const tx = await contract.submitReport(category, description, location); // Pass location to contract
        await tx.wait();
        alert("Report submitted successfully!");
        // Reset fields after submission
        setCategory("");
        setDescription("");
        setLocation(""); // Reset location
      } catch (error) {
        console.error("Error submitting report:", error);
        alert("Failed to submit report.");
      }
    } else {
      alert("Please provide category, description, and location.");
    }
  };

  const handleResolveReport = async () => {
    if (reportId) {
      try {
        const tx = await contract.markReportAsResolved(reportId);
        await tx.wait();
        alert("Report resolved successfully!");
        // Reset the report ID after resolution
        setReportId("");
      } catch (error) {
        console.error("Error resolving report:", error);
        alert("Failed to resolve report.");
      }
    } else {
      alert("Please provide a valid report ID.");
    }
  };

  return (
    <div className="report-issue-container">
      <h1>Report Issue or Resolve Report</h1>

      <div className="user-type-selection">
        <button onClick={() => setUserType("user")}>I am a User</button>
        <button onClick={() => setUserType("authority")}>I am an Authority</button>
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
            value={location} // Location input
            onChange={(e) => setLocation(e.target.value)} // Handle location change
          />
          <input
            type="number"
            placeholder="Points"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            disabled
          />
          <input
            type="number"
            placeholder="Upvotes"
            value={upvotes}
            onChange={(e) => setUpvotes(Number(e.target.value))}
            disabled
          />
          <input
            type="number"
            placeholder="Downvotes"
            value={downvotes}
            onChange={(e) => setDownvotes(Number(e.target.value))}
            disabled
          />
          <button onClick={handleSubmitReport}>Submit Report</button>
        </div>
      )}

      {userType === "authority" && (
        <div className="resolve-form">
          <h2>Resolve a Report</h2>
          <input
            type="text"
            placeholder="Report ID"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
          />
          <button onClick={handleResolveReport}>Resolve Report</button>
        </div>
      )}

      <div className="account-info">
        <p>Connected Account: {account}</p>
      </div>
    </div>
  );
};

export default ReportIssue;
