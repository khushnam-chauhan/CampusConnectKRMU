import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/userProfileSlice";
import "./ProfilePage.css";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.userProfile);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="no-data">No User Data Found</div>;

  const openResume = () => {
    if (user.resume) {
      window.open(`${import.meta.env.VITE_BACKEND_URL}${user.resume}`, "_blank");
    }
  };

  const openCertificate = (cert) => {
    if (cert.image) {
      window.open(`${import.meta.env.VITE_BACKEND_URL}${cert.image}`, "_blank");
    }
  };

  // Helper function to check if Masters details exist
  const hasMastersDetails = () => {
    const masters = user.education?.masters;
    return (
      masters &&
      (masters.degree || masters.percentageOrCGPA || masters.passingYear)
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-basic-info">
          <div className="info-text">
            <p><strong>Name:</strong> {user.fullName}</p>
            <p>
              <strong>Course:</strong>{" "}
              {user.education?.masters?.degree ||
                user.education?.graduation?.degree ||
                "N/A"}
            </p>
            <p><strong>College:</strong> {user.school || "N/A"}</p>
            <p><strong>Contact no.:</strong> {user.mobileNo || "N/A"}</p>
            <p><strong>Email id:</strong> {user.email || "N/A"}</p>
            <p>
              <strong>Area of interest:</strong> {user.areaOfInterest || "N/A"}
            </p>
          </div>
          <div className="profile-photo-section1">
            <div className="profile-photo-container1">
              {user.profilePhoto ? (
                <img
                  src={
                    user.profilePhoto.startsWith("http")
                      ? user.profilePhoto
                      : `${import.meta.env.VITE_BACKEND_URL}${user.profilePhoto}`
                  }
                  alt="Profile"
                  className="profile-photo1"
                />
              ) : (
                <div className="profile-photo-placeholder1"></div>
              )}
            </div>
            <Link to="/student-details">
              <button className="edit-btn">Edit</button>
            </Link>
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <h2>Resume</h2>
          </div>
          <div className="section-content">
            <div
              className={`resume-card ${user.resume ? "clickable" : ""}`}
              onClick={user.resume ? openResume : undefined}
            >
              {user.resume ? (
                <>
                  <p>{user.fullName} resume.pdf</p>
                  <div className="view-indicator">Click to view</div>
                </>
              ) : (
                "No resume uploaded."
              )}
            </div>
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <h2>Skills</h2>
          </div>
          <div className="section-content">
            <div className="skills-container">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {typeof skill === "string" ? skill : skill.name}
                  </div>
                ))
              ) : (
                <p>No skills added yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <h2>Education</h2>
          </div>
          <div className="section-content education-grid">
            <div className="education-item">
              <h3>10th</h3>
              <p>Percentage/CGPA: {user.education?.tenth?.percentage || "N/A"}</p>
              <p>Year: {user.education?.tenth?.passingYear || "N/A"}</p>
            </div>
            <div className="education-item">
              <h3>12th</h3>
              <p>Percentage: {user.education?.twelfth?.percentage || "N/A"}</p>
              <p>Year: {user.education?.twelfth?.passingYear || "N/A"}</p>
            </div>
            <div className="education-item">
              <h3>Graduation</h3>
              <p>Degree: {user.education?.graduation?.degree || "N/A"}</p>
              <p>
                Percentage/CGPA:{" "}
                {user.education?.graduation?.percentageOrCGPA || "N/A"}
              </p>
              <p>Year: {user.education?.graduation?.passingYear || "N/A"}</p>
            </div>
            {hasMastersDetails() && (
              <div className="education-item">
                <h3>Masters</h3>
                <p>Degree: {user.education?.masters?.degree || "N/A"}</p>
                <p>
                  Percentage/CGPA:{" "}
                  {user.education?.masters?.percentageOrCGPA || "N/A"}
                </p>
                <p>Year: {user.education?.masters?.passingYear || "N/A"}</p>
              </div>
            )}
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <h2>Certifications</h2>
          </div>
          <div className="section-content">
            {user.certifications?.length > 0 ? (
              user.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="certification-card clickable"
                  onClick={() => openCertificate(cert)}
                >
                  <p>{cert.name}</p>
                  {cert.image && (
                    <div className="view-indicator">Click to view</div>
                  )}
                </div>
              ))
            ) : (
              <div className="certification-card empty">
                No certifications available.
              </div>
            )}
          </div>
        </div>

        <div className="section-container">
          <div className="section-header">
            <h2>Experience</h2>
          </div>
          <div className="section-content experience-cards">
            {user.experience &&
            user.experience.length > 0 &&
            user.experience.some((exp) => exp.hasExperience || exp.organizationName) ? (
              user.experience
                .filter((exp) => exp.hasExperience || exp.organizationName)
                .map((exp, index) => (
                  <div className="experience-card" key={exp._id || index}>
                    <h3>Full-stack developer</h3>
                    <p>{exp.organizationName || "N/A"}</p>
                    <p>({exp.duration || "N/A"})</p>
                    {exp.details && (
                      <p className="experience-details">{exp.details}</p>
                    )}
                  </div>
                ))
            ) : (
              <div className="experience-card empty">No experience added.</div>
            )}
          </div>
        </div>

        

        {/* Hidden tabs content */}
        <div className="hidden-tabs">
          <div className="tabs">
            <button
              className={activeTab === "personal" ? "active" : ""}
              onClick={() => setActiveTab("personal")}
            >
              Personal Info
            </button>
            <button
              className={activeTab === "education" ? "active" : ""}
              onClick={() => setActiveTab("education")}
            >
              Education
            </button>
            <button
              className={activeTab === "experience" ? "active" : ""}
              onClick={() => setActiveTab("experience")}
            >
              Experience
            </button>
            <button
              className={activeTab === "certifications" ? "active" : ""}
              onClick={() => setActiveTab("certifications")}
            >
              Certifications
            </button>
          </div>

          <div className="tab-content" style={{ display: "none" }}>
            {activeTab === "personal" && (
              <div className="tab-panel">
                <p><strong>Roll No:</strong> {user.rollNo || "N/A"}</p>
                <p><strong>Mobile No:</strong> {user.mobileNo || "N/A"}</p>
                <p><strong>WhatsApp No:</strong> {user.whatsappNo || "N/A"}</p>
                <p><strong>Mail ID:</strong> {user.email || "N/A"}</p>
                <p><strong>Father's Name:</strong> {user.fatherName || "N/A"}</p>
                <p>
                  <strong>Father's Contact:</strong> {user.fatherNumber || "N/A"}
                </p>
              </div>
            )}

            {activeTab === "education" && (
              <div className="tab-panel">
                <p><strong>School:</strong> {user.school || "N/A"}</p>
                <p>
                  <strong>Year of Passing KRMU:</strong>{" "}
                  {user.education?.masters?.passingYear ||
                    user.education?.graduation?.passingYear ||
                    "N/A"}
                </p>
                <p>
                  <strong>Course Aggregate:</strong>{" "}
                  {user.education?.masters?.percentageOrCGPA ||
                    user.education?.graduation?.percentageOrCGPA ||
                    "N/A"}
                </p>
                <p>
                  <strong>10th Percentage:</strong>{" "}
                  {user.education?.tenth?.percentage || "N/A"}
                </p>
                <p>
                  <strong>12th Percentage:</strong>{" "}
                  {user.education?.twelfth?.percentage || "N/A"}
                </p>
                <p>
                  <strong>Graduation:</strong>{" "}
                  {user.education?.graduation?.degree || "N/A"} (
                  {user.education?.graduation?.percentageOrCGPA || "N/A"})
                </p>
                {hasMastersDetails() && (
                  <p>
                    <strong>Masters:</strong>{" "}
                    {user.education?.masters?.degree || "N/A"} (
                    {user.education?.masters?.percentageOrCGPA || "N/A"})
                  </p>
                )}
              </div>
            )}

            {activeTab === "experience" && (
              <div className="tab-panel">
                {user.experience?.hasExperience ? (
                  <div>
                    <p>
                      <strong>Organization Name:</strong>{" "}
                      {user.experience.organizationName}
                    </p>
                    <p>
                      <strong>Duration:</strong> {user.experience.duration}
                    </p>
                    <p>
                      <strong>Details:</strong> {user.experience.details}
                    </p>
                  </div>
                ) : (
                  <p>No experience added.</p>
                )}
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="tab-panel">
                {user.certifications?.length > 0 ? (
                  user.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <p><strong>{cert.name}</strong></p>
                      {cert.image && (
                        <img
                          src={
                            `${import.meta.env.VITE_BACKEND_URL}${cert.image}` ||
                            "N/A"
                          }
                          alt={cert.name}
                          className="certification-image"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p>No certifications available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;