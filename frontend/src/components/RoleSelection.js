// src/components/RoleSelection.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/shared.css';
import Header from './Header';
import Footer from './Footer';
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import ReportsModal from './ReportsModal';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allReports, setAllReports] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          "0xa0393b172c532f3b2b0cba1088822579c8659019", 
          contractABI, 
          signer
        );
        setContract(contract);
        await fetchAllReports(contract);
      }
    };
    initialize();
  }, []);

  const fetchAllReports = async (contract) => {
    try {
      const reportCount = await contract.reportCount();
      const reports = [];
      
      for (let i = 1; i <= reportCount; i++) {
        const report = await contract.getReport(i);
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
      
      setAllReports(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const features = [
    {
      icon: "🔍",
      title: "Issue Tracking",
      description: "Real-time monitoring of civic issues with blockchain verification"
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      description: "Participate in issue resolution through voting and feedback"
    },
    {
      icon: "🏆",
      title: "Reward System",
      description: "Earn points for active participation and issue reporting"
    },
    {
      icon: "📊",
      title: "Transparent Governance",
      description: "All actions are recorded on the blockchain for full transparency"
    }
  ];

  return (
    <div className="page-container">
      <Header />
      
      <main className="gradient-bg main-content">
        <section className="hero-section">
          <h1 className="gradient-text">Welcome to CivicGuard</h1>
          <p className="hero-subtitle">
            Empowering communities through blockchain-based civic engagement
          </p>
          
          <div className="role-buttons">
            <button 
              className="button-primary authority-btn"
              onClick={() => navigate('/authority-dashboard')}
            >
              I am an Authority
            </button>
            <button 
              className="button-primary user-btn"
              onClick={() => navigate('/report-issue')}
            >
              I am a User
            </button>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Platform Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>500+</h3>
              <p>Issues Resolved</p>
            </div>
            <div className="stat-card">
              <h3>1000+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>Authorities</p>
            </div>
          </div>
        </section>
      </main>

      <div 
        className="fab"
        onClick={() => setIsModalOpen(true)}
        title="View All Reports"
      >
        <span className="fab-icon">📋</span>
      </div>

      <ReportsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reports={allReports}
      />
      
      <Footer />
    </div>
  );
};

export default RoleSelection;