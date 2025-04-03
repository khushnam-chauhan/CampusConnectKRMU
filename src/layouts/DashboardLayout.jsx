import React, { useState } from "react";
import Sidebar from "../pages/dashboard/Sidebar";
import { Menu } from "lucide-react";
import "../pages/dashboard/dashboard.css"; 

const DashboardLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <h1 className="portal-title">CampusConnect - Student Dashboard</h1>
        </header>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
