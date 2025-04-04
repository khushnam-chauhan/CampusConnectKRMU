import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/applications/my-applications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setApplications(response.data);
      } catch (err) {
        setError("Applications not loaded.");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="my-applications">
      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="no-applications">No Applications!</div>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>CTC/Stipend</th>
              <th>Location</th>
              <th>Job Type</th>
              <th>Status</th>
              <th>Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className={`status-${app.status.toLowerCase()}`}>
                <td>{app.jobId.profiles}</td>
                <td>{app.jobId.companyName}</td>
                <td>{app.jobId.ctcOrStipend}</td>
                <td>{app.jobId.location}</td>
                <td>{app.jobId.offerType.join(", ")}</td>
                <td>{app.status}</td>
                <td>{formatDate(app.appliedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;