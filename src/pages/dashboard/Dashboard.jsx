"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Book, Menu } from "lucide-react"
import "./dashboard.css"
import TrainingCard from "../../components/TrainingCard"
import DashboardCard from "../../components/DashboardCard"

export default function CampusConnectDashboard() {

  return (
    <div className="dashboard-container">
     
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h2 className="welcome-heading">Welcome back</h2>
          <p className="welcome-subtext">Here's what's happening with your academic journey</p>
        </div>
        <Link to="/internships" className="apply-button1">
          Apply for Internship
        </Link>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
      <DashboardCard to={"/job-listings"} title={"Recommended Jobs"} number={"18"} subtitle={"6 new since last week"} bgColor={"#818cf8"} hoverBgColor={"#6366f1"} />
      <DashboardCard to={"/my-applications"} title={"Application Status"} number={"3"} subtitle={"2 under review, 1 accepted"} bgColor={"#4ade80"} hoverBgColor={"#22c55e"} />
      <DashboardCard to={"/notifications"} title={"New Notifications"} number={"5"} subtitle={"2 job alerts, 3 updates"} bgColor={"#f87171"} hoverBgColor={"#ef4444"} />
      <DashboardCard to={"/cv"} title={"CV Insights"} number={"85%"} subtitle={"Completeness score"} bgColor={"#2563eb"} hoverBgColor={"#1d4ed8"} />
    </div>

      {/* Upcoming Trainings */}
      <div className="trainings-container">
        <h3 className="trainings-title">Upcoming CDC Trainings</h3>

       
         <TrainingCard  name={"Interview Skills Seminar"} date={"May 20, 2025 - 3:30 PM"}/>
         <TrainingCard  name={"Interview Skills Seminar"} date={"May 20, 2025 - 3:30 PM"}/>
         <TrainingCard  name={"Interview Skills Seminar"} date={"May 20, 2025 - 3:30 PM"}/>
    
      </div>
    </div>
  )
}

