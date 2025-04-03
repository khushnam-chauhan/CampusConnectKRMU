import React, { useState } from "react";
import "./JobDescription.css";

const JobDescriptionPage = ({ job, onClose, onApply, isAdmin = false }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleApplyClick = () => {
    setIsApplying(true);
    setSubmitStatus(null); // Reset status on new apply attempt
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleCloseApplyForm = () => {
    setIsApplying(false);
    setFormData({ fullName: "", email: "", phone: "", resume: null }); // Reset form
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.resume) {
      setSubmitStatus("error");
      return;
    }
  
    const data = new FormData();
    data.append("jobId", job._id);
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("resume", formData.resume);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token-based auth
        },
        body: data,
      });
      if (!response.ok) throw new Error("Application failed");
      setSubmitStatus("success");
      setTimeout(() => {
        handleCloseApplyForm();
      }, 2000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <div className="job-description-overlay">
      <div className="job-description__container">
        {/* Close Button */}
        <button className="job-description__close-btn" onClick={onClose}>
          ×
        </button>

        {/* Header: Position + Company Logo + Name */}
        <div className="job-description__header2">
          <h1 className="job-title-head2">{job.profiles}</h1>
          <div className="job-header-details2">
            <img src={job.companyLogo} alt="Company Logo" className="company-logo" />
            <div className="job-header-company2">
              <p className="company-name2">{job.companyName}</p>
              <p className="company-website2">
                <a href={job.website} target="_blank" rel="noreferrer">
                  Visit Website
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Highlighted Details */}
        <div className="jd-layout">
          <div className="job-description__details2">
            <div className="job-info2">
              <span>💸 CTC/Stipend:</span>
              <p>{job.ctcOrStipend}</p>
            </div>
            <div className="job-info2">
              <span>📌 Location:</span>
              <p>{job.location}</p>
            </div>
            <div className="job-info2">
              <span>🛠 Job Type:</span>
              <p>{job.offerType}</p>
            </div>
            <div className="job-info2">
              <span>📅 Vacancies:</span>
              <p>{job.vacancies}</p>
            </div>
          </div>
          <div className="job-description__details2">
          <div className="job-info2">
                <span>👤 Referred by:</span>
                <p>
                  {job.reference && job.reference !== "Self" 
                    ? job.reference 
                    : `${job.contactPersonName} (${job.email})`}
                </p>
              </div>
            <div className="job-info2">
              <span>Category:</span>
              <p>{job.category.join(", ")}</p>
            </div>
            <div className="job-info2">
              <span>Starting date:</span>
              <p>{formatDate(job.dateOfJoining)}</p>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="job-description__body2">
          <h2>Job Description</h2>
          <p>{job.jobDescription}</p>

          <h2>Eligibility Criteria</h2>
          <p>{job.eligibility}</p>

          <h2>Skills Required</h2>
          <div className="job-description__skills2">
            {job.skills &&
              job.skills.map((skill, index) => (
                <span key={index} className="job-description__skill-tag2">
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {/* Apply Button */}
        {!isAdmin && (
          <div className="job-description__footer">
            <button className="job-description__apply-btn" onClick={handleApplyClick}>
              Apply Now
            </button>
            <button className="job-description__close-details-btn" onClick={onClose}>
              Back to Job Listings
            </button>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {isApplying && (
        <div className="apply-form-overlay">
          <div className="apply-form-container">
            <h2>Apply for {job.profiles}</h2>
            {submitStatus === "success" ? (
              <p className="success-msg">Application submitted successfully! 🎉</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleInputChange}
                  required
                />
                {submitStatus === "error" && (
                  <p className="error-msg">Please fill all fields correctly!</p>
                )}
                <div className="form-actions">
                  <button type="submit">Submit Application</button>
                  <button type="button" onClick={handleCloseApplyForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionPage;