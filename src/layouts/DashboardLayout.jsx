import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // For detecting current page
import Sidebar from "../pages/dashboard/Sidebar";
import { Menu } from "lucide-react";
import "../pages/dashboard/dashboard.css"; 

const DashboardLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Hook to get current URL

  // Menu items same as in Sidebar (to map path to name)
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Home", path: "/" },
    { name: "CV Insights", path: "/cv" },
    { name: "Job Listings", path: "/job-listings" },
    { name: "My Applications", path: "/my-applications" },
    { name: "CDC Trainings", path: "/cdc-trainings" },
    { name: "Profile", path: "/profile" },
    { name: "Admin Dashboard", path: "/admin-mgmnt" },
    { name: "Applications", path: "/admin-applications" }, 
  ];

  // Find current page name based on location.pathname
  const currentPage = menuItems.find((item) => item.path === location.pathname)?.name || "Unknown";

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar isOpen={isMenuOpen} onItemClick={() => setIsMenuOpen(false)} />

      <div className="main-content">
        {/* Header with Menu Button */}
        <header className="dashboard-header">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="menu-button"
          >
            <Menu size={20} />
          </button>
          <h1 className="portal-title">CampusConnect - {currentPage}</h1>
        </header>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;