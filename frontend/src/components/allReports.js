import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder

const contractAddress = "0xa0393b172c532f3b2b0cba1088822579c8659019"; // Smart contract address

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
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

  // Function to handle upvoting
  const handleUpvote = async (reportId) => {
    try {
      setTransactionLoading(true);

      if (window.ethereum) {
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

  // Function to handle downvoting
  const handleDownvote = async (reportId) => {
    try {
      setTransactionLoading(true);

      if (window.ethereum) {
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
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No reports found.</p>
        )}
      </div>
    </div>
  );
}

export default Reports;
