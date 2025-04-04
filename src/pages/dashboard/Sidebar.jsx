import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, fetchUser } from "../../redux/authSlice";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onItemClick }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !user && !loading) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, user, loading, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth-Container");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Home", path: "/" },
    { name: "Job Listings", path: "/job-listings" },
    { name: "My Applications", path: "/my-applications" },
    { name: "CDC Trainings", path: "/trainings" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
    ...(user?.role === "admin"
      ? [{ name: "Admin Dashboard", path: "/admin-mgmnt" }]
      : []),
  ];

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      {/* Hamburger Icon when closed */}
      {!isOpen && (
        <div className="hamburger-icon" onClick={onItemClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="sidebar-content">
        {/* Close Button when open */}
        {isOpen && (
          <button className="close-btn" onClick={onItemClick}>
            ✕
          </button>
        )}

        <nav className="sidebar-nav">
          <ul className="menu-list">
            <li className="user-info">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {user?.profilePhoto && (
                    <div className="profile-pic">
                      <img
                        className="profile-img"
                        src={
                          user.profilePhoto.startsWith("http")
                            ? user.profilePhoto
                            : `${import.meta.env.VITE_BACKEND_URL}${
                                user.profilePhoto
                              }`
                        }
                        alt="Profile"
                      />
                    </div>
                  )}
                  <p>Hi, {user?.fullName || "User"} 👋</p>
                </>
              )}
            </li>

            {/* Sidebar Menu */}
            {menuItems.map((item) => (
              <li key={item.name} className="menu-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={onItemClick}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* Logout Button */}
            <li className="menu-item logout">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;