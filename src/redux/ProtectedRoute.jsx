import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const hasToken = localStorage.getItem("token");
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // First check - Are we loading?
  if (loading || (!user && hasToken)) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  }

  // Second check - Do we have authentication?
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/auth-Container" state={{ from: location }} replace />;
  }

  // Third check - Role-based access check
  if (!user || !user.role) {
    return <Navigate to="/auth-Container" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin' || user.role === 'staff') {
      return <Navigate to="/admin-panel" replace />;
    }
    if (user.role === 'student') {
      return <Navigate to="/student-details" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;