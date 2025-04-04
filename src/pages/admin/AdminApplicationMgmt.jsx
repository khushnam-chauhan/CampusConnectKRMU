import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminApplicationManagement.css";

const AdminApplicationManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApps, setSelectedApps] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "appliedDate", direction: "desc" });
  const [modalApp, setModalApp] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL; // http://localhost:3000/api

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/applications/jobs`, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(Array.isArray(response.data) ? response.data : []); 
      setError(null);
    } catch (err) {
      setError("Failed to load jobs: " + (err.response?.data?.message || err.message));
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (jobId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/applications/applications/${jobId}`, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(Array.isArray(response.data) ? response.data : []);
      setSelectedJob(jobs.find(job => job._id === jobId));
      setSelectedApps([]);
      setError(null);
    } catch (err) {
      setError("Failed to load applications: " + (err.response?.data?.message || err.message));
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/applications/applications/${appId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(applications.map(app => (app._id === appId ? response.data : app)));
      if (modalApp && modalApp._id === appId) setModalApp(response.data);
    } catch (err) {
      setError(`Failed to update status to ${newStatus}.`);
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteApp = async (appId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/applications/applications/${appId}`, { 
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(applications.filter(app => app._id !== appId));
        setSelectedApps(selectedApps.filter(id => id !== appId));
        if (modalApp && modalApp._id === appId) setModalApp(null);
        setJobs(jobs.map(job => 
          job._id === selectedJob._id ? { ...job, applicationCount: job.applicationCount - 1 } : job
        ));
      } catch (err) {
        setError("Failed to delete application.");
        console.error("Error deleting application:", err);
      }
    }
  };

  const handleSelectApp = (appId) => {
    setSelectedApps(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const handleSelectAll = () => {
    setSelectedApps(selectedApps.length === applications.length ? [] : applications.map(app => app._id));
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedApps.length} applications?`)) {
      try {
        const token = localStorage.getItem("token");
        await Promise.all(
          selectedApps.map(id =>
            axios.delete(`${API_URL}/applications/applications/${id}`, { // No extra /api
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );
        setApplications(applications.filter(app => !selectedApps.includes(app._id)));
        setJobs(jobs.map(job => 
          job._id === selectedJob._id ? { ...job, applicationCount: job.applicationCount - selectedApps.length } : job
        ));
        setSelectedApps([]);
      } catch (err) {
        setError("Failed to delete some applications.");
        console.error("Error bulk deleting:", err);
      }
    }
  };

  const sortJobs = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setJobs([...jobs].sort((a, b) => {
      const aValue = a[key] || "";
      const bValue = b[key] || "";
      return direction === "asc"
        ? aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true })
        : bValue.toString().localeCompare(aValue.toString(), undefined, { numeric: true });
    }));
  };

  const sortApplications = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setApplications([...applications].sort((a, b) => {
      const aValue = key === "appliedDate" ? a[key] : a.userId?.[key] || a[key] || "";
      const bValue = key === "appliedDate" ? b[key] : b.userId?.[key] || b[key] || "";
      return direction === "asc"
        ? aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true })
        : bValue.toString().localeCompare(aValue.toString(), undefined, { numeric: true });
    }));
  };

  const openAppModal = (app) => setModalApp(app);
  const closeAppModal = () => setModalApp(null);
  const goBackToJobs = () => {
    setSelectedJob(null);
    setApplications([]);
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="admin-application-management1">
      {error && <div className="error-message">{error}</div>}

      {!selectedJob ? (
        <>
          <div className="control-panel3">
            <button onClick={loadJobs} className="refresh-button1">Refresh Jobs</button>
          </div>

          {loading ? (
            <div className="loading">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="no-items">No jobs found.</div>
          ) : (
            <div className="job-list">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => sortJobs("profiles")}>Job Profile</th>
                    <th onClick={() => sortJobs("companyName")}>Company</th>
                    <th onClick={() => sortJobs("ctcOrStipend")}>CTC/Stipend</th>
                    <th onClick={() => sortJobs("location")}>Location</th>
                    <th onClick={() => sortJobs("applicationCount")}>Applications</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} className="job-row3">
                      <td>{job.profiles || "N/A"}</td>
                      <td>{job.companyName || "N/A"}</td>
                      <td>{job.ctcOrStipend || "N/A"}</td>
                      <td>{job.location || "N/A"}</td>
                      <td>{job.applicationCount || 0}</td>
                      <td>
                        <button onClick={() => loadApplications(job._id)} className="view-button">
                          View Applications
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="control-panel3">
            <button onClick={goBackToJobs} className="back-button">Back to Jobs</button>
            <button onClick={() => loadApplications(selectedJob._id)} className="refresh-button1">
              Refresh Applications
            </button>
            {selectedApps.length > 0 && (
              <div className="bulk-actions3">
                <span>{selectedApps.length} selected</span>
                <button onClick={handleBulkDelete} className="delete-button">Delete Selected</button>
              </div>
            )}
          </div>

          <h3>Applications for {selectedJob.profiles} - {selectedJob.companyName}</h3>

          {loading ? (
            <div className="loading">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="no-items">No applications for this job.</div>
          ) : (
            <div className="application-list3">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedApps.length === applications.length && applications.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th onClick={() => sortApplications("fullName")}>Applicant Name</th>
                    <th onClick={() => sortApplications("email")}>Email</th>
                    <th onClick={() => sortApplications("status")}>Status</th>
                    <th onClick={() => sortApplications("appliedDate")}>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id} className={`app-row status-${app.status.toLowerCase()}`}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedApps.includes(app._id)}
                          onChange={() => handleSelectApp(app._id)}
                        />
                      </td>
                      <td>{app.userId?.fullName || "N/A"}</td>
                      <td>{app.email}</td>
                      <td><span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span></td>
                      <td>{formatDate(app.appliedDate)}</td>
                      <td className="action-buttons">
                        <button onClick={() => openAppModal(app)} className="details-button">View</button>
                        <button onClick={() => handleDeleteApp(app._id)} className="delete-button">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modalApp && (
        <div className="modal">
          <div className="modal-content">
            <h3>Application Details</h3>
            <div className="app-details">
              <div className="detail-section">
                <h4>Applicant Information</h4>
                <div className="detail-grid">
                  <div>
                    <p><strong>Name:</strong> {modalApp.userId?.fullName || "N/A"}</p>
                    <p><strong>Email:</strong> {modalApp.email}</p>
                    <p><strong>Phone:</strong> {modalApp.phone}</p>
                  </div>
                  <div>
                    <p><strong>Roll No:</strong> {modalApp.userId?.rollNo || "N/A"}</p>
                    <p><strong>Resume:</strong> {modalApp.resume ? <a href={`${API_URL}${modalApp.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a> : "Not uploaded"}</p>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>Job Information</h4>
                <div className="detail-grid">
                  <div>
                    <p><strong>Profile:</strong> {modalApp.jobId?.profiles || "N/A"}</p>
                    <p><strong>Company:</strong> {modalApp.jobId?.companyName || "N/A"}</p>
                  </div>
                  <div>
                    <p><strong>CTC/Stipend:</strong> {modalApp.jobId?.ctcOrStipend || "N/A"}</p>
                    <p><strong>Location:</strong> {modalApp.jobId?.location || "N/A"}</p>
                    <p><strong>Type:</strong> {modalApp.jobId?.offerType || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="detail-section3">
                <h4>Application Status</h4>
                <p><strong>Status:</strong> {modalApp.status}</p>
                <p><strong>Applied Date:</strong> {formatDate(modalApp.appliedDate)}</p>
                <div className="status-buttons3">
                  {["Applied", "Scheduled", "Accepted", "Rejected"].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(modalApp._id, status)}
                      className={`status-button ${modalApp.status === status ? "active" : ""}`}
                      disabled={modalApp.status === status}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={closeAppModal} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationManagement;