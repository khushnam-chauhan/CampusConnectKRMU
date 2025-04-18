"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Book, Menu } from "lucide-react";
import "./dashboard.css";
import TrainingCard from "../../components/TrainingCard";
import DashboardCard from "../../components/DashboardCard";

export default function CampusConnectDashboard() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trainings from the backend
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trainings`);
        if (!response.ok) {
          throw new Error("Failed to fetch trainings");
        }
        const data = await response.json();
        // Filter upcoming trainings and sort by date
        const upcomingTrainings = data
          .filter((training) => new Date(training.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setTrainings(upcomingTrainings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h2 className="welcome-heading">Welcome back</h2>
          <p className="welcome-subtext">Here's what's happening with your academic journey</p>
        </div>
        {/* <Link to="/internships" className="apply-button1">
          Apply for Internship
        </Link> */}
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <DashboardCard
          to={"/job-listings"}
          title={"Recommended Jobs"}
          number={"18"}
          subtitle={"6 new since last week"}
          bgColor={"#818cf8"}
          hoverBgColor={"#6366f1"}
        />
        <DashboardCard
          to={"/my-applications"}
          title={"Application Status"}
          number={"3"}
          subtitle={"2 under review, 1 accepted"}
          bgColor={"#4ade80"}
          hoverBgColor={"#22c55e"}
        />
        
        <DashboardCard
          to={"/cv"}
          title={"CV Insights"}
          number={"85%"}
          subtitle={"Completeness score"}
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