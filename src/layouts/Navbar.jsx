import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control hamburger menu visibility
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="log">
          <h1 className="logo-head">
            Campus<span className="logoColor">Connect</span>
          </h1>
        </Link>
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger-icon1" onClick={toggleMenu}>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        {!isLoggedIn && (
          <Link to="/about">
            <button className="nav-btn">About</button>
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/dashboard">
            <button className="nav-btn dashbtn">Dashboard</button>
          </Link>
        )}
        {isLoggedIn ? (
          <button className="nav-btn logout-btn1" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/authContainer">
            <button className="nav-btn">Sign In</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
