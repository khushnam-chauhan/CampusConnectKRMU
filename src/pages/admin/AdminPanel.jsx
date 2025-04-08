import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import AdminUserManagement from './AdminUserMgmt';
import AdminApplicationManagement from './AdminApplicationMgmt';
import AdminBulkEmail from './AdminEmailBulk';
import AdminJobs from './jobmanager/AdminJobs';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import axios from 'axios';

// API base URL set for port 3000
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const api = {

  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/users`, userData, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  // User management API functions (unchanged)
  fetchUsers: async (filters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.role && filters.role !== 'all') queryParams.append('role', filters.role);
      if (filters?.search) queryParams.append('search', filters.search);
      const response = await axios.get(`${API_BASE_URL}/admin/users?${queryParams}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, userData, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  changeUserRole: async (userId, role) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/role`, { role }, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  },
  // Job management API functions (unchanged)
  fetchJobs: async (filters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);
      const response = await axios.get(`${API_BASE_URL}/jobs/admin/jobs?${queryParams}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },
  updateJob: async (jobId, jobData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/jobs/${jobId}`, jobData, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },
  deleteJob: async (jobId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/jobs/${jobId}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },
  // Application management API functions (unchanged)
  fetchApplications: async (filters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.jobId) queryParams.append('jobId', filters.jobId);
      const response = await axios.get(`${API_BASE_URL}/applications?${queryParams}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },
  updateApplicationStatus: async (appId, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/applications/${appId}`, { status }, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },
  // Email API functions (unchanged)
  fetchUserGroups: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/user-groups`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw error;
    }
  },
  fetchEmailTemplates: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/email-templates`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },
  saveTemplate: async (template) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profile/email-templates`, template, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  },
  sendBulkEmail: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profile/send-bulk-email`, formData, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error sending bulk email:', error);
      throw error;
    }
  },
};

const AdminPanel = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/auth-Container";
  };

  const [activeSection, setActiveSection] = useState('dashboard');
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeUsers: 0, pendingApprovals: 0 });
  const [applicationStats, setApplicationStats] = useState({ totalApplications: 0, pendingReview: 0, approved: 0, rejected: 0 });
  const [jobStats, setJobStats] = useState({ totalJobs: 0, activeJobs: 0, expiredJobs: 0 });
  const [emailStats, setEmailStats] = useState({ emailsSent: 0, lastCampaign: '-', openRate: '-' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // User stats
      const usersResponse = await axios.get(`${API_BASE_URL}/admin/stats/users`, getAuthConfig());
      if (usersResponse.data) {
        setUserStats({
          totalUsers: usersResponse.data.totalUsers || 0,
          activeUsers: usersResponse.data.activeUsers || 0,
          pendingApprovals: usersResponse.data.pendingApprovals || 0,
        });
      }

      // Application stats
      const applicationsResponse = await axios.get(`${API_BASE_URL}/jobs/stats/applications`, getAuthConfig());
      if (applicationsResponse.data) {
        setApplicationStats({
          totalApplications: applicationsResponse.data.totalApplications || 0,
          pendingReview: applicationsResponse.data.pendingReview || 0,
          approved: applicationsResponse.data.approved || 0,
          rejected: applicationsResponse.data.rejected || 0,
        });
      }

      // Job stats
      const jobsResponse = await axios.get(`${API_BASE_URL}/jobs/stats`, getAuthConfig());
      if (jobsResponse.data) {
        setJobStats({
          totalJobs: jobsResponse.data.totalJobs || 0,
          activeJobs: jobsResponse.data.activeJobs || 0,
          expiredJobs: jobsResponse.data.expiredJobs || 0,
        });
      }

      // Email stats (optional, might not exist yet)
      try {
        const emailResponse = await axios.get(`${API_BASE_URL}/profile/stats/emails`, getAuthConfig());
        if (emailResponse.data) {
          setEmailStats({
            emailsSent: emailResponse.data.emailsSent || 0,
            lastCampaign: emailResponse.data.lastCampaign || '-',
            openRate: emailResponse.data.openRate || '-',
          });
        }
      } catch (emailErr) {
        console.warn('Email stats not available:', emailErr.message);
      }

      setError(null);
    } catch (err) {
      console.error('Fetch dashboard stats error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        handleLogout();
      } else if (err.response?.status === 500) {
        setError('Server error while fetching stats. Please try again later.');
      } else {
        setError(`Failed to load dashboard: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    return (
      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stats-card">
                <h3>User Management</h3>
                <div className="stat-item"><span className="stat-label">Total Users:</span><span className="stat-value">{userStats.totalUsers}</span></div>
                <div className="stat-item"><span className="stat-label">Active Users:</span><span className="stat-value">{userStats.activeUsers}</span></div>
                <div className="stat-item"><span className="stat-label">Pending Approvals:</span><span className="stat-value">{userStats.pendingApprovals}</span></div>
                <button className="view-more-button" onClick={() => setActiveSection('users')}>Manage Users</button>
              </div>
              <div className="stats-card">
                <h3>Application Management</h3>
                <div className="stat-item"><span className="stat-label">Total Applications:</span><span className="stat-value">{applicationStats.totalApplications}</span></div>
                <div className="stat-item"><span className="stat-label">Pending Review:</span><span className="stat-value">{applicationStats.pendingReview}</span></div>
                <div className="stat-item"><span className="stat-label">Approval Rate:</span><span className="stat-value">
                  {applicationStats.approved + applicationStats.rejected > 0 
                    ? ((applicationStats.approved / (applicationStats.approved + applicationStats.rejected)) * 100).toFixed(1) + '%'
                    : '0%'}
                </span></div>
                <button className="view-more-button" onClick={() => setActiveSection('applications')}>Manage Applications</button>
              </div>
              <div className="stats-card">
                <h3>Job Management</h3>
                <div className="stat-item"><span className="stat-label">Total Jobs:</span><span className="stat-value">{jobStats.totalJobs}</span></div>
                <div className="stat-item"><span className="stat-label">Active Jobs:</span><span className="stat-value">{jobStats.activeJobs}</span></div>
                <div className="stat-item"><span className="stat-label">Expired Jobs:</span><span className="stat-value">{jobStats.expiredJobs}</span></div>
                <button className="view-more-button" onClick={() => setActiveSection('jobs')}>Manage Jobs</button>
              </div>
              <div className="stats-card">
                <h3>Email System</h3>
                <div className="stat-item"><span className="stat-label">Emails Sent:</span><span className="stat-value">{emailStats.emailsSent}</span></div>
                <div className="stat-item"><span className="stat-label">Last Campaign:</span><span className="stat-value">{emailStats.lastCampaign}</span></div>
                <div className="stat-item"><span className="stat-label">Open Rate:</span><span className="stat-value">{emailStats.openRate}</span></div>
                <button className="view-more-button" onClick={() => setActiveSection('emails')}>Send Emails</button>
              </div>
            </div>
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="refresh-action">
                <button onClick={fetchDashboardStats} className="refresh-button">Refresh Dashboard</button>
              </div>
              <div className="activity-list">
                <div className="activity-item"><span className="activity-time">Today, 10:45 AM</span><span className="activity-description">New user registrations</span></div>
                <div className="activity-item"><span className="activity-time">Today, 09:30 AM</span><span className="activity-description">New job applications submitted</span></div>
                <div className="activity-item"><span className="activity-time">Yesterday, 4:15 PM</span><span className="activity-description">Bulk email campaign sent</span></div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'users': return <AdminUserManagement fetchUsers={api.fetchUsers} updateUser={api.updateUser} deleteUser={api.deleteUser} changeUserRole={api.changeUserRole} createUser={api.createUser} />;
      case 'jobs': return <AdminJobs fetchJobs={api.fetchJobs} updateJob={api.updateJob} deleteJob={api.deleteJob} />;
      case 'applications': return <AdminApplicationManagement fetchApplications={api.fetchApplications} updateApplicationStatus={api.updateApplicationStatus} />;
      case 'emails': return <AdminBulkEmail fetchUserGroups={api.fetchUserGroups} fetchEmailTemplates={api.fetchEmailTemplates} saveTemplate={api.saveTemplate} sendBulkEmail={api.sendBulkEmail} />;
      default: return renderDashboard();
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-sidebar">
        <div className="admin-logo"><h1>Admin Panel</h1></div>
        <nav className="admin-nav">
          <ul>
            <li className={activeSection === 'dashboard' ? 'active' : ''}><button onClick={() => setActiveSection('dashboard')}><span className="nav-icon">📊</span>Dashboard</button></li>
            <li className={activeSection === 'users' ? 'active' : ''}><button onClick={() => setActiveSection('users')}><span className="nav-icon">👥</span>User Management</button></li>
            <li className={activeSection === 'jobs' ? 'active' : ''}><button onClick={() => setActiveSection('jobs')}><span className="nav-icon">💼</span>Job Management</button></li>
            <li className={activeSection === 'applications' ? 'active' : ''}><button onClick={() => setActiveSection('applications')}><span className="nav-icon">📝</span>Applications</button></li>
            <li className={activeSection === 'emails' ? 'active' : ''}><button onClick={() => setActiveSection('emails')}><span className="nav-icon">📧</span>Bulk Email</button></li>
          </ul>
        </nav>
        <div className="admin-profile">
          <div className="profile-info">
            <div className="profile-avatar">A</div>
            <div className="profile-details"><div className="profile-name">Admin User</div><div className="profile-role">Super Admin</div></div>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <div className="breadcrumb"><span>Admin</span><span className="separator">/</span><span>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span></div>
          <div className="header-actions">
            <div className="search-box"><input type="text" placeholder="Search..." /><button className="search-button">🔍</button></div>
            <button className="notification-button">🔔<span className="notification-badge">3</span></button>
          </div>
        </div>
        <div className="admin-body">{renderActiveSection()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;