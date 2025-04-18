"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book, Menu } from "lucide-react";
import "./dashboard.css";
import TrainingCard from "../../components/TrainingCard";
import DashboardCard from "../../components/DashboardCard";

export default function CampusConnectDashboard() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAreaJobs, setUserAreaJobs] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [applications, setApplications] = useState([]);
  const [applicationCounts, setApplicationCounts] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0
  });
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const navigate = useNavigate();

  // Fetch trainings, user profile, area-of-interest jobs, and total approved jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trainings
        const trainingResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trainings`);
        if (!trainingResponse.ok) {
          throw new Error("Failed to fetch trainings");
        }
        const trainingData = await trainingResponse.json();
        
        // Filter upcoming trainings and sort by date
        const upcomingTrainings = trainingData
          .filter((training) => new Date(training.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setTrainings(upcomingTrainings);
        
        // Fetch user profile to get area of interest
        const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile/me`, {
          credentials: 'include'
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo(userData);
          
          // If user has area of interest, fetch matching jobs
          if (userData.areaOfInterest) {
            const jobsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs?profiles=${encodeURIComponent(userData.areaOfInterest)}`, {
              credentials: 'include'
            });
            
            if (jobsResponse.ok) {
              const jobsData = await jobsResponse.json();
              setUserAreaJobs(jobsData);
            }
          }
        }

        // Fetch all jobs to count approved ones (same as JobListingPage)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        const jobsArray = data.data || [];
        const approvedJobs = jobsArray.filter(job => job.status === 'approved');
        setTotalJobs(approvedJobs.length);

        // Fetch applications data
        await fetchApplicationsData();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to fetch applications data
  const fetchApplicationsData = async () => {
    setApplicationsLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("No authentication token found");
        setApplicationCounts({
          total: 0,
          pending: 0,
          underReview: 0,
          accepted: 0,
          rejected: 0
        });
        setApplicationsLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/applications/my-applications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const applicationsData = await response.json();
      setApplications(applicationsData);

      // Calculate counts by status
      const counts = {
        total: applicationsData.length,
        pending: 0,
        underReview: 0,
        accepted: 0,
        rejected: 0
      };

      applicationsData.forEach(app => {
        if (app.status === "Pending") {
          counts.pending++;
        } else if (app.status === "Under Review") {
          counts.underReview++;
        } else if (app.status === "Accepted") {
          counts.accepted++;
        } else if (app.status === "Rejected") {
          counts.rejected++;
        }
      });

      setApplicationCounts(counts);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplicationCounts({
        total: 0,
        pending: 0,
        underReview: 0,
        accepted: 0,
        rejected: 0
      });
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Create application status subtitle
  const getApplicationStatusSubtitle = () => {
    if (applicationsLoading) {
      return "Loading application data...";
    }
    
    if (applicationCounts.total === 0) {
      return "No applications yet";
    }

    const parts = [];
    if (applicationCounts.underReview > 0) {
      parts.push(`${applicationCounts.underReview} under review`);
    }
    if (applicationCounts.accepted > 0) {
      parts.push(`${applicationCounts.accepted} accepted`);
    }
    if (applicationCounts.pending > 0) {
      parts.push(`${applicationCounts.pending} pending`);
    }
    if (applicationCounts.rejected > 0) {
      parts.push(`${applicationCounts.rejected} rejected`);
    }

    return parts.join(", ");
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h2 className="welcome-heading">Welcome back</h2>
          <p className="welcome-subtext">Here's what's happening with your academic journey</p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <DashboardCard
          to="/job-listings"
          title={"Find Latest Jobs"}
          number={loading ? "..." : totalJobs.toString()}
          subtitle={"Explore new opportunities"}
          bgColor={"#818cf8"}
          hoverBgColor={"#6366f1"}
        />
        <DashboardCard
          to={"/my-applications"}
          title={"Application Status"}
          number={applicationsLoading ? "..." : applicationCounts.total.toString()}
          subtitle={getApplicationStatusSubtitle()}
          bgColor={"#4ade80"}
          hoverBgColor={"#22c55e"}
        />
        <DashboardCard
          to={"/cv"}
          title={"CV Insights"}
          subtitle={"Review your resume"}
          bgColor={"#2563eb"}
          hoverBgColor={"#1d4ed8"}
        />
      </div>

      {/* Upcoming Trainings */}
      <div className="trainings-container">
        <div className="trainings-header">
          <h3 className="trainings-title">Upcoming CDC Trainings</h3>
          <Link to="/cdc-trainings" className="view-all-link">
            View All
          </Link>
        </div>
        {loading ? (
          <p className="loading">Loading trainings...</p>
        ) : error ? (
          <p className="error">Error: {error}</p>
        ) : trainings.length === 0 ? (
          <p className="no-trainings">No upcoming trainings scheduled.</p>
        ) : (
          trainings.map((training) => (
            <TrainingCard
              key={training._id}
              title={training.title}
              date={training.date}
            />
          ))
        )}
      </div>
    </div>
  );
}
