import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./AdminJobs.css"; 
import AdminJobForm from "./AdminJobForm";

const AdminJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [currentJob, setCurrentJob] = useState(null);
  const [moreFilters, setMoreFilters] = useState(false); // Toggle for more/less filters

  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    profiles: "",
    offerType: [],
    location: "",
    skills: "",
    category: "",
    companyName: "",
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  function debounce(func, wait) {
    let timeout;
    const debounced = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced;
  }

  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiParams = {};
      if (params.status && params.status !== "all") apiParams.status = params.status;
      if (params.profiles) apiParams.profiles = params.profiles;
      if (params.offerType.length > 0) apiParams.offerType = params.offerType.join(",");
      if (params.location) apiParams.location = params.location;
      if (params.skills) apiParams.skills = params.skills;
      if (params.category) apiParams.category = params.category;
      if (params.companyName) apiParams.companyName = params.companyName;
      if (params.search && params.search.trim() !== "") apiParams.search = params.search.trim();

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/jobs/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: apiParams,
      });

      const jobData = Array.isArray(response.data.data) ? response.data.data : response.data;
      setJobs(jobData || []);
      setError(null);
      setSelectedJobs([]);
    } catch (err) {
      setError(`Failed to load jobs: ${err.response?.data?.message || err.message}`);
      setJobs([]);
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch (err) {
      console.error(`Error ${newStatus} job:`, err);
      throw new Error(err.response?.data?.message || `Failed to ${newStatus} job`);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (err) {
      console.error("Error deleting job:", err);
      throw new Error(err.response?.data?.message || "Failed to delete job");
    }
  };

  const loadJobs = useCallback(async () => {
    await fetchJobs(filters);
  }, [filters]);

  const debouncedLoadJobs = useCallback(debounce(() => loadJobs(), 500), [loadJobs]);

  useEffect(() => {
    if (filters.status !== "all") {
      loadJobs();
    } else {
      debouncedLoadJobs();
    }
    return () => debouncedLoadJobs.cancel();
  }, [filters, debouncedLoadJobs, loadJobs]);

  const sortJobs = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedJobs = [...jobs].sort((a, b) => {
      if (!a[key] && !b[key]) return 0;
      if (!a[key]) return direction === "asc" ? 1 : -1;
      if (!b[key]) return direction === "asc" ? -1 : 1;
      if (key === "offerType") {
        const aValue = a[key].join(", ");
        const bValue = b[key].join(", ");
        return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setJobs(sortedJobs);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleOfferTypeFilterChange = (value) => {
    setFilters({
      ...filters,
      offerType: filters.offerType.includes(value)
        ? filters.offerType.filter((t) => t !== value)
        : [...filters.offerType, value],
    });
  };

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      search: "",
      profiles: "",
      offerType: [],
      location: "",
      skills: "",
      category: "",
      companyName: "",
    });
    setMoreFilters(false);
  };

  const handleSelectJob = (jobId) => {
    setSelectedJobs(
      selectedJobs.includes(jobId)
        ? selectedJobs.filter((id) => id !== jobId)
        : [...selectedJobs, jobId]
    );
  };

  const handleSelectAll = () => {
    setSelectedJobs(selectedJobs.length === jobs.length ? [] : jobs.map((job) => job._id));
  };

  const handleApprove = async (jobId) => {
    try {
      await updateJobStatus(jobId, "approved");
      setJobs(jobs.map((job) => (job._id === jobId ? { ...job, status: "approved" } : job)));
      setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
      setError(null);
    } catch (err) {
      setError(`Failed to approve job: ${err.message}`);
    }
  };

  const handleReject = async (jobId) => {
    try {
      await updateJobStatus(jobId, "rejected");
      setJobs(jobs.map((job) => (job._id === jobId ? { ...job, status: "rejected" } : job)));
      setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
      setError(null);
    } catch (err) {
      setError(`Failed to reject job: ${err.message}`);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        await deleteJob(jobId);
        setJobs(jobs.filter((job) => job._id !== jobId));
        setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
        setError(null);
      } catch (err) {
        setError(`Failed to delete job: ${err.message}`);
      }
    }
  };

  const handleBulkApprove = async () => {
    if (window.confirm(`Are you sure you want to approve ${selectedJobs.length} jobs?`)) {
      try {
        await Promise.all(selectedJobs.map((id) => updateJobStatus(id, "approved")));
        setJobs(jobs.map((job) => (selectedJobs.includes(job._id) ? { ...job, status: "approved" } : job)));
        setSelectedJobs([]);
        setError(null);
      } catch (err) {
        setError(`Failed to approve some jobs: ${err.message}`);
      }
    }
  };

  const handleBulkReject = async () => {
    if (window.confirm(`Are you sure you want to reject ${selectedJobs.length} jobs?`)) {
      try {
        await Promise.all(selectedJobs.map((id) => updateJobStatus(id, "rejected")));
        setJobs(jobs.map((job) => (selectedJobs.includes(job._id) ? { ...job, status: "rejected" } : job)));
        setSelectedJobs([]);
        setError(null);
      } catch (err) {
        setError(`Failed to reject some jobs: ${err.message}`);
      }
    }
  };

  const openCreateModal = () => {
    setCurrentJob(null);
    setFormMode("create");
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setCurrentJob(job);
    setFormMode("edit");
    setModalOpen(true);
  };

  const openViewModal = (job) => {
    setCurrentJob(job);
    setViewModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setViewModalOpen(false);
    setCurrentJob(null);
  };

  const handleFormSubmit = (jobData, mode) => {
    if (mode === "create") {
      setJobs([jobData, ...jobs]);
    } else {
      setJobs(jobs.map((job) => (job._id === jobData._id ? jobData : job)));
    }
    closeModal();
  };

  return (
    <div className="admin-job-management">
      <h2>Job Management Dashboard</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="control-panel">
        <button className="create-button" onClick={openCreateModal}>
          Add New Job
        </button>

        <div className="filter-controls">
          <div className="filter-row">
            <label>
              Company Name:
              <input
                type="text"
                name="companyName"
                value={filters.companyName}
                onChange={handleFilterChange}
                placeholder="Filter by company"
              />
            </label>
            <label>
              Profile:
              <input
                type="text"
                name="profiles"
                value={filters.profiles}
                onChange={handleFilterChange}
                placeholder="Filter by profile"
              />
            </label>
            <label>
              Status:
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="all">All Jobs</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <button className="filter-toggle-btn" onClick={() => setMoreFilters(!moreFilters)}>
              {moreFilters ? "Less Filters" : "More Filters"}
            </button>
          </div>

          {moreFilters && (
            <div className="more-filters">
              <div className="filter-row">
                <label>
                  Offer Types:
                  <div className="multi-select">
                    {["Full time Employment", "Internship + PPO", "Apprenticeship", "Summer Internship"].map((type) => (
                      <label key={type} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={type}
                          checked={filters.offerType.includes(type)}
                          onChange={() => handleOfferTypeFilterChange(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </label>
                <label>
                  Location:
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Filter by location"
                  />
                </label>
                <label>
                  Skills:
                  <input
                    type="text"
                    name="skills"
                    value={filters.skills}
                    onChange={handleFilterChange}
                    placeholder="Filter by skills"
                  />
                </label>
                <label>
                  Category:
                  <input
                    type="text"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    placeholder="Filter by category"
                  />
                </label>
                <label>
                  Search:
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search any keyword..."
                  />
                </label>
              </div>
            </div>
          )}

          <div className="filter-actions">
            <button onClick={loadJobs} className="refresh-button">Refresh</button>
            <button onClick={handleClearFilters} className="clear-button">Clear Filters</button>
          </div>
        </div>

        {selectedJobs.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedJobs.length} selected</span>
            <button onClick={handleBulkApprove} className="approve-button">Approve Selected</button>
            <button onClick={handleBulkReject} className="reject-button">Reject Selected</button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="no-items">No jobs found matching your criteria.</div>
        ) : (
          <div className="job-list">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === jobs.length && jobs.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th onClick={() => sortJobs("companyName")}>Company</th>
                  <th onClick={() => sortJobs("profiles")}>Profile</th>
                  <th onClick={() => sortJobs("offerType")}>Offer Type</th>
                  <th onClick={() => sortJobs("location")}>Location</th>
                  <th onClick={() => sortJobs("createdAt")}>Posted Date</th>
                  <th onClick={() => sortJobs("status")}>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className={`job-row ${job.status}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() => handleSelectJob(job._id)}
                      />
                    </td>
                    <td>
                      <div className="company-info">
                        {job.companyLogo && (
                          <img src={job.companyLogo} alt="Logo" className="company-logo-small" />
                        )}
                        {job.companyName}
                      </div>
                    </td>
                    <td>{job.profiles}</td>
                    <td>{job.offerType.join(", ")}</td>
                    <td>{job.location}</td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${job.status}`}>{job.status}</span>
                    </td>
                    <td className="action-buttons">
                      <button onClick={() => openViewModal(job)} className="details-button">View</button>
                      <button onClick={() => openEditModal(job)} className="edit-button">Edit</button>
                      {job.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(job._id)} className="approve-button">Approve</button>
                          <button onClick={() => handleReject(job._id)} className="reject-button">Reject</button>
                        </>
                      )}
                      <button onClick={() => handleDelete(job._id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit/Create Modal */}
        {modalOpen && (
          <div className="job-description-overlay">
            <div className="job-description__container">
              <button className="job-description__close-btn" onClick={closeModal}>×</button>
              <div className="job-description__header2">
                <h1 className="job-title-head2">{currentJob ? "Edit Job" : "Create New Job"}</h1>
                <div className="job-header-details2">
                  {currentJob?.companyLogo && (
                    <img src={currentJob.companyLogo} alt="Company Logo" className="company-logo" />
                  )}
                  <div className="job-header-company2">
                    <p className="company-name2">{currentJob?.companyName || "New Company"}</p>
                    {currentJob?.website && (
                      <p className="company-website2">
                        <a href={currentJob.website} target="_blank" rel="noreferrer">Visit Website</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <AdminJobForm
                formMode={formMode}
                initialData={currentJob}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewModalOpen && currentJob && (
          <div className="job-description-overlay">
            <div className="job-description__container">
              <button className="job-description__close-btn" onClick={closeModal}>×</button>
              <div className="job-description__header2">
                <h1 className="job-title-head2">{currentJob.profiles}</h1>
                <div className="job-header-details2">
                  {currentJob.companyLogo && (
                    <img src={currentJob.companyLogo} alt="Company Logo" className="company-logo" />
                  )}
                  <div className="job-header-company2">
                    <p className="company-name2">{currentJob.companyName}</p>
                    <p className="company-website2">
                      <a href={currentJob.website} target="_blank" rel="noreferrer">Visit Website</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="jd-layout">
                <div className="job-description__details2">
                  <div className="job-info2">
                    <span>💸 CTC/Stipend:</span>
                    <p>{currentJob.ctcOrStipend}</p>
                  </div>
                  <div className="job-info2">
                    <span>📌 Location:</span>
                    <p>{currentJob.location}</p>
                  </div>
                  <div className="job-info2">
                    <span>🛠 Job Type:</span>
                    <p>{currentJob.offerType.join(", ")}</p>
                  </div>
                  <div className="job-info2">
                    <span>📅 Vacancies:</span>
                    <p>{currentJob.vacancies}</p>
                  </div>
                </div>
                <div className="job-description__details2">
                  <div className="job-info2">
                    <span>Referred by:</span>
                    <p>{currentJob.contactPersonName}</p>
                  </div>
                  <div className="job-info2">
                    <span>Category:</span>
                    <p>{currentJob.category.join(", ")}</p>
                  </div>
                  <div className="job-info2">
                    <span>Starting Date:</span>
                    <p>{formatDate(currentJob.dateOfJoining)}</p>
                  </div>
                  <div className="job-info2">
                    <span>Office Address:</span>
                    <p>{currentJob.officeAddress}</p>
                  </div>
                </div>
              </div>
              <div className="job-description__body2">
                <h2>Job Description</h2>
                <p>{currentJob.jobDescription}</p>
                <h2>Eligibility Criteria</h2>
                <p>{currentJob.eligibility}</p>
                <h2>Skills Required</h2>
                <div className="job-description__skills2">
                  {currentJob.skills.map((skill, index) => (
                    <span key={index} className="job-description__skill-tag2">{skill}</span>
                  ))}
                </div>
                <h2>Additional Information</h2>
                <p>{currentJob.additionalInfo || "N/A"}</p>
                <h2>Contact Information</h2>
                <p><strong>Contact Person:</strong> {currentJob.contactPersonName}</p>
                <p><strong>Contact Number:</strong> {currentJob.contactNumber}</p>
                <p><strong>Email:</strong> {currentJob.email}</p>
                <h2>Company Details</h2>
                <p><strong>Year of Establishment:</strong> {currentJob.yearOfEstablishment}</p>
                <p><strong>Reference:</strong> {currentJob.reference}</p>
                <p><strong>Result Declaration:</strong> {currentJob.resultDeclaration}</p>
                <p><strong>Status:</strong> <span className={`status-badge ${currentJob.status}`}>{currentJob.status}</span></p>
              </div>
              <div className="job-description__footer">
                <button className="job-description__close-details-btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobManagement;