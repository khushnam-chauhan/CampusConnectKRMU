import React, { useState, useEffect } from "react";

const AdminHamburgerMenu = ({ activeSection, setActiveSection, userRole, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resizing to adapt the menu behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    if (windowWidth <= 768) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Hamburger button - only visible on mobile */}
      <div className="hamburger-menu-button">
        <button onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile overlay for the sidebar when menu is open */}
      {isMenuOpen && windowWidth <= 768 && (
        <div className="mobile-menu-overlay" onClick={toggleMenu}></div>
      )}

      {/* Navigation - styled differently based on screen size */}
      <div className={`admin-sidebar ${isMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-logo">
          <h1>{userRole === "staff" ? "Staff Panel" : "Admin Panel"}</h1>
        </div>
        <nav className="admin-nav">
          <ul>
            {/* Only show dashboard and other admin-only sections to admins */}
            {userRole === "admin" && (
              <>
                <li className={activeSection === "dashboard" ? "active" : ""}>
                  <button onClick={() => handleNavClick("dashboard")}>
                    <span className="nav-icon">📊</span>Dashboard
                  </button>
                </li>
                <li className={activeSection === "users" ? "active" : ""}>
                  <button onClick={() => handleNavClick("users")}>
                    <span className="nav-icon">👥</span>User Management
                  </button>
                </li>
                <li className={activeSection === "jobs" ? "active" : ""}>
                  <button onClick={() => handleNavClick("jobs")}>
                    <span className="nav-icon">💼</span>Job Management
                  </button>
                </li>
                <li className={activeSection === "applications" ? "active" : ""}>
                  <button onClick={() => handleNavClick("applications")}>
                    <span className="nav-icon">📝</span>Applications
                  </button>
                </li>
              </>
            )}
            
            {/* Show these sections to both admin and staff */}
            <li className={activeSection === "emails" ? "active" : ""}>
              <button onClick={() => handleNavClick("emails")}>
                <span className="nav-icon">📧</span>Bulk Email
              </button>
            </li>
            <li className={activeSection === "trainings" ? "active" : ""}>
              <button onClick={() => handleNavClick("trainings")}>
                <span className="nav-icon">🎓</span>Trainings
              </button>
            </li>
          </ul>
        </nav>
        {/* Include profile and logout in the sidebar */}
        <div className="admin-profile">
          <div className="profile-info">
            <div className="profile-avatar">
              {userRole === "admin" ? "A" : "S"}
            </div>
            <div className="profile-details">
              <div className="profile-name">{userRole === "admin" ? "Admin User" : "Staff User"}</div>
              <div className="profile-role">{userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Loading..."}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </>
  );
};

export default AdminHamburgerMenu;