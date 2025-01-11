import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder

const contractAddress = "0xa0393b172c532f3b2b0cba1088822579c8659019"; // Replace with your deployed contract address

const AuthorityDashboard = () => {
  const [reports, setReports] = useState([]);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [location, setLocation] = useState(""); // State for location input
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

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

        // Fetch reports from the contract
        await fetchReports(_contract);
      } else {
        alert("Please install MetaMask!");
      }
    };
    initialize();
  }, []);

  const fetchReports = async (contract) => {
    try {
      const reportCount = await contract.reportCount();
      const fetchedReports = [];

      for (let i = 1; i <= reportCount; i++) {
        const report = await contract.getReport(i);
        fetchedReports.push({
          id: i,
          reporter: report[0],
          category: report[1],
          description: report[2],
          location: report[3], // Location added here
          points: report[4].toString(),
          upvotes: report[5].toString(),
          downvotes: report[6].toString(),
          isResolved: report[7],
        });
      }

      setReports(fetchedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleResolveReport = async (id) => {
    try {
      const tx = await contract.markReportAsResolved(id);
      await tx.wait();
      alert("Report marked as resolved!");
      fetchReports(contract); // Refresh the list of reports
    } catch (error) {
      console.error("Error resolving report:", error);
      alert("Failed to resolve report.");
    }
  };

  const handleSubmitReport = async () => {
    if (!category || !description || !location) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const tx = await contract.submitReport(category, description, location);
      await tx.wait();
      alert("Report submitted successfully!");
      fetchReports(contract); // Refresh the list of reports
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report.");
    }
  };

  return (
    <div className="authority-dashboard">
      <h1>Authority Dashboard</h1>
      <p>Connected Account: {account}</p>

      {/* <div className="new-report">
        <h2>Submit a New Report</h2>
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
      </div> */}

      <div className="reports-list">
        <h2>Reports</h2>
        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-item">
              <h3>Report ID: {report.id}</h3>
              <p><strong>Category:</strong> {report.category}</p>
              <p><strong>Description:</strong> {report.description}</p>
              <p><strong>Location:</strong> {report.location}</p>
              <p><strong>Points:</strong> {report.points}</p>
              <p><strong>Upvotes:</strong> {report.upvotes}</p>
              <p><strong>Downvotes:</strong> {report.downvotes}</p>
              <p><strong>Status:</strong> {report.isResolved ? "Resolved" : "Not Resolved"}</p>

              {/* {!report.isResolved && (
                <button onClick={() => handleResolveReport(report.id)}>Resolve Report</button>
              )} */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;
