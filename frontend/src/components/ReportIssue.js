import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client
import { contractABI } from "../utils/contractABI"; // Import ABI from utils folder
import '../styles/shared.css';
import Header from "./Header";
import Footer from "./Footer";

// Supabase configuration
const supabaseUrl = "https://tayizflnglzdhygwqqvk.supabase.co"; // Replace with your Supabase project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRheWl6ZmxuZ2x6ZGh5Z3dxcXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MDIzNTcsImV4cCI6MjA1MjE3ODM1N30.PaQNZFpNoUawIxbpGaY7CgAaieBuc9Q4TF2m04SDVno"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const contractAddress = "0xa0393b172c532f3b2b0cba1088822579c8659019"; // Replace with your deployed contract address

const ReportIssue = () => {
  const [userType, setUserType] = useState(""); // 'authority' or 'user'
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null); // Store the selected file
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userReports, setUserReports] = useState([]); // Store user's reports

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);

        const accounts = await _provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const signer = await _provider.getSigner();
        const _contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(_contract);

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
      const totalReports = await contract.reportCount();
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

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); // Store the file for later upload
      alert("File selected: " + uploadedFile.name);
    } else {
      alert("Please select a file to upload.");
    }
  };

  const handleSubmitReport = async () => {
    if (category && description && location && file) {
      try {
        // Upload the file to Supabase Storage
        const filePath = `${account}/${Date.now()}-${file.name}`; // Unique path for each user and file
        const { data: fileData, error: fileError } = await supabase.storage
          .from("points") // Replace with your Supabase bucket name
          .upload(filePath, file);
  
        if (fileError) {
          throw fileError;
        }
  
        // Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from("points")
          .getPublicUrl(filePath);
        const fileUrl = publicUrlData.publicUrl;
  
        // Submit the report to the smart contract
        const tx = await contract.submitReport(category, description, location);
        const receipt = await tx.wait();
  
        // Extract the Report ID from the transaction receipt (assuming it's logged in the event)
        const event = receipt.events.find((e) => e.event === "ReportSubmitted"); // Replace with your event name
        const reportId = event?.args?.[0]?.toString(); // Adjust the index if Report ID is not the first argument
  
        if (!reportId) {
          throw new Error("Unable to fetch Report ID from transaction.");
        }
  
        // Get points mapped to the user address from the smart contract
        const userPoints = await contract.points(account);
  
        // Insert entry into the User_Details table
        const { data: insertData, error: insertError } = await supabase
          .from("User_Details") // Replace with your table name
          .insert([
            {
              Report_ID: reportId,
              User_address: account,
              points: userPoints.toString(),
              media: fileUrl,
            },
          ]);
  
        if (insertError) {
          throw insertError;
        }
  
        alert("Report submitted successfully and entry added to the database!");
        setCategory("");
        setDescription("");
        setLocation("");
        setFile(null);
  
        fetchUserReports(contract, account);
      } catch (error) {
        console.error("Error submitting report:", error);
        alert("Failed to submit report or update database.");
      }
    } else {
      alert("Please provide all details and upload a file.");
    }
  };
  

  const handleUpvote = async (reportId) => {
    try {
      const tx = await contract.upvoteReport(reportId);
      await tx.wait();
      alert("Report upvoted successfully!");
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
                  style={{ minHeight: "120px" }}
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
              <div className="input-group">
                <label className="input-label">Upload File</label>
                <input
                  className="input-field"
                  type="file"
                  onChange={(e) => handleFileUpload(e)}
                />
              </div>
              <button className="button-primary" onClick={handleSubmitReport}>
                Submit Report
              </button>
            </div>
          </div>
          <h2 className="section-title">Your Reports</h2>
          {/* Display user reports */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportIssue;