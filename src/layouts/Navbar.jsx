import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/"); 
    window.location.reload(); 
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
      <div className="nav-links">
        {!isLoggedIn && ( 
          <Link to="#">
            <button className="nav-btn">About</button>
          </Link>
        )}
        {isLoggedIn && ( 
          <Link to="/dashboard">
            <button className="nav-btn dashbtn">Dashboard</button>
          </Link>
        )}
        {isLoggedIn ? (
          <button className="nav-btn logout-btn1" onClick={handleLogout}>Logout</button>
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
