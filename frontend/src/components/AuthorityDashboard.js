import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder
import '../styles/shared.css';
import Header from "./Header";
import Footer from "./Footer";

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
    <div className="page-container">
      <Header />
      
      <main className="gradient-bg main-content">
        <div className="dashboard-container">
          <h1 className="page-title">Authority Dashboard</h1>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Total Reports</h3>
              <p style={{ fontSize: '2rem', color: 'var(--primary)' }}>{reports.length}</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Pending</h3>
              <p style={{ fontSize: '2rem', color: 'var(--error)' }}>
                {reports.filter(r => !r.isResolved).length}
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Resolved</h3>
              <p style={{ fontSize: '2rem', color: 'var(--success)' }}>
                {reports.filter(r => r.isResolved).length}
              </p>
            </div>
          </div>

          <div className="dashboard-grid">
            {reports.map((report) => (
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
                  <span>👍 {report.upvotes}</span>
                  <span>👎 {report.downvotes}</span>
                  <span>🏆 {report.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthorityDashboard;
