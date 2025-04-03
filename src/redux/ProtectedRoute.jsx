import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const hasToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  
  // Get user from Redux store
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  
  // First check - Are we loading?
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  }
  
  // Second check - Do we have authentication?
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/auth-Container" state={{ from: location }} replace />;
  }
  
  // Third check - Use either Redux user or localStorage role
  const userRole = user?.role || storedRole;
  
  // Fourth check - Role-based access check
  if (userRole && !allowedRoles.includes(userRole)) {
    if (userRole === 'admin' || userRole === 'staff') {
      return <Navigate to="/admin-panel" replace />;
    }
    if (userRole === 'student') {
      return <Navigate to="/student-details" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;