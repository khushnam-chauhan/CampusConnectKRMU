"use client"

import { useState } from "react"
import { FaMapMarkerAlt, FaBuilding, FaUsers, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa"
import defaultLogo from "../../assets/hero-img.png"
import JobDescriptionPage from "./JobDescription"

const JobCard = ({ job }) => {
  const [showJobDescription, setShowJobDescription] = useState(false)

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const handleViewDetails = () => {
    setShowJobDescription(true)
  }

  const handleCloseDescription = () => {
    setShowJobDescription(false)
  }

  const handleApply = (formData, jobId) => {
    // Handle the application submission
    console.log("Application submitted:", formData)
    console.log("For job:", jobId)

    
    // submitApplication(formData, jobId)
    //   .then(response => {
    //     console.log('Application submitted successfully');
    //   })
    //   .catch(error => {
    //     console.error('Error submitting application:', error);
    //   });
  }

  return (
    <>
      <div className="job-card">
        <div className="job-card-header">
          <div className="company-logo">
            <img src={job.companyLogo || defaultLogo} alt={`${job.companyName} logo`} />
          </div>
          <div className="job-title-section">
            <h3 className="job-title">{job.profiles}</h3>
            <h4 className="company-name">{job.companyName}</h4>
          </div>
        </div>

        <div className="job-details">
          <div className="job-detail-item">
            <FaMapMarkerAlt className="job-icon" />
            <span>{job.location}</span>
          </div>

          <div className="job-detail-item">
            <FaBuilding className="job-icon" />
            <span>{job.offerType}</span>
          </div>

          <div className="job-detail-item">
            <FaUsers className="job-icon" />
            <span>
              {job.vacancies} {job.vacancies > 1 ? "positions" : "position"}
            </span>
          </div>

          <div className="job-detail-item">
            <FaMoneyBillWave className="job-icon" />
            <span>{job.ctcOrStipend}</span>
          </div>
          <div className="job-detail-item">
            <FaMoneyBillWave className="job-icon" />
            <span>skills: {job.skills.join(', ')}</span>
          </div>

          {/* <div className="job-detail-item">
            <FaCalendarAlt className="job-icon" />
            <span>Join by: {formatDate(job.dateOfJoining)}</span>
          </div> */}
        </div>

        {job.eligibility && (
          <div className="job-eligibility">
            <h4>Eligibility:</h4>
            <p>{job.eligibility.length > 100 ? `${job.eligibility.substring(0, 100)}...` : job.eligibility}</p>
          </div>
        )}

        <div className="job-card-footer">
          <button onClick={handleViewDetails} className="view-details-btn">
            View Details
          </button>
          <p className="posted-date">Posted: {job.createdAt ? formatDate(job.createdAt) : "Recently"}</p>
        </div>
      </div>

      {showJobDescription && <JobDescriptionPage job={job} onClose={handleCloseDescription} onApply={handleApply} />}
    </>
  )
}

export default JobCard

