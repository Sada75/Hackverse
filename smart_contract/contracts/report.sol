// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HackverseReport {

    // Struct to hold report data
    struct Report {
        uint256 id;
        address reporter;
        string category;
        string description;
        string location; // Added location field
        uint256 points;
        uint256 upvotes;
        uint256 downvotes;
        bool isResolved;  // Flag to indicate if the issue is marked as resolved
    }

    // Mappings
    mapping(uint256 => Report) public reports;   // Mapping of report ID to Report struct
    mapping(address => uint256) public userPoints;   // Mapping of user address to points
    mapping(address => mapping(uint256 => bool)) public userVotedUp;   // Mapping for user upvote history per report
    mapping(address => mapping(uint256 => bool)) public userVotedDown;   // Mapping for user downvote history per report

    // Variables
    uint256 public reportCount;
    address public owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier notResolved(uint256 reportId) {
        require(!reports[reportId].isResolved, "This report has already been resolved");
        _;
    }

    modifier onlyReporter(uint256 reportId) {
        require(msg.sender == reports[reportId].reporter, "Only the reporter can mark this as resolved");
        _;
    }

    modifier hasNotVoted(uint256 reportId, bool isUpvote) {
        if (isUpvote) {
            require(!userVotedUp[msg.sender][reportId], "You have already upvoted this report");
        } else {
            require(!userVotedDown[msg.sender][reportId], "You have already downvoted this report");
        }
        _;
    }

    // Events
    event ReportSubmitted(uint256 reportId, address reporter, string category, string location);
    event PointsAdded(address user, uint256 points);
    event PointsDeducted(address user, uint256 points);
    event ReportResolved(uint256 reportId, bool isResolved);

    // Constructor
    constructor() {
        owner = msg.sender;
        reportCount = 0;
    }

    // Functions
    // Submit a new report
    function submitReport(string memory category, string memory description, string memory location) public {
        reportCount++;
        reports[reportCount] = Report({
            id: reportCount,
            reporter: msg.sender,
            category: category,
            description: description,
            location: location, // Store location
            points: 0,
            upvotes: 0,
            downvotes: 0,
            isResolved: false // Initially not resolved
        });

        emit ReportSubmitted(reportCount, msg.sender, category, location);
    }

    // Add points to a user (owner only)
    function addPoints(address user, uint256 points) public onlyOwner {
        userPoints[user] += points;
        emit PointsAdded(user, points);
    }

    // Deduct points from a user (owner only)
    function deductPoints(address user, uint256 points) public onlyOwner {
        require(userPoints[user] >= points, "Insufficient points");
        userPoints[user] -= points;
        emit PointsDeducted(user, points);
    }

    // View points of a user
    function getPoints(address user) public view returns (uint256) {
        return userPoints[user];
    }

    // Upvote a report
    function upvoteReport(uint256 reportId) public hasNotVoted(reportId, true) notResolved(reportId) {
        reports[reportId].upvotes++;
        userVotedUp[msg.sender][reportId] = true;
        userPoints[msg.sender] += 1;   // Reward user with 1 point for upvoting
        emit PointsAdded(msg.sender, 1);
    }

    // Downvote a report
    function downvoteReport(uint256 reportId) public hasNotVoted(reportId, false) notResolved(reportId) {
        reports[reportId].downvotes++;
        userVotedDown[msg.sender][reportId] = true;
        userPoints[msg.sender] -= 1;   // Deduct 1 point from the user for downvoting
        emit PointsDeducted(msg.sender, 1);
    }

    // Mark report as resolved (only the reporter can mark as resolved)
    function markReportAsResolved(uint256 reportId) public onlyReporter(reportId) notResolved(reportId) {
        reports[reportId].isResolved = true;  // Reporter marks the report as resolved
        emit ReportResolved(reportId, true);
    }

    // Get report details
    function getReport(uint256 reportId) public view returns (address, string memory, string memory, string memory, uint256, uint256, uint256, bool) {
        Report memory report = reports[reportId];
        return (report.reporter, report.category, report.description, report.location, report.points, report.upvotes, report.downvotes, report.isResolved);
    }

    // Admin can transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
