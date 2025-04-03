import React from 'react';

const CertificationsSection = ({ 
  hasCertifications, 
  certifications, 
  handleChange, 
  addCertification, 
  removeCertification 
}) => {
  return (
    <>
      <div className="form-group">
        <label>Do you have any certifications?</label>
        <div className="checkbox-container">
        <label htmlFor="hasCertifications">Yes</label>
          <input
            type="checkbox"
            name="hasCertifications"
            checked={hasCertifications}
            onChange={handleChange}
            id="hasCertifications"
          />
         
        </div>
      </div>

      {hasCertifications && (
        <div className="certifications-container">
          {certifications.length === 0 && (
            <p className="no-items-message">Add at least one certification</p>
          )}
          
          {certifications.map((cert, index) => (
            <div key={index} className="certification-item">
              <div className="form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  placeholder="Course name"
                  name={`certification-${index}`}
                  value={cert.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Certificate Image</label>
                <div className="file-input-container">
                  <button
                    type="button"
                    className="file-select-btn"
                    onClick={() => document.getElementById(`certImage-${index}`).click()}
                  >
                    {cert.image ? "Change Image" : "Select Image"}
                  </button>
                  <span className="file-name">
                    {cert.image
                      ? typeof cert.image === "string"
                        ? "Image uploaded"
                        : cert.image.name
                      : "No file selected"}
                  </span>
                </div>
                <input
                  id={`certImage-${index}`}
                  type="file"
                  name={`certificationImage-${index}`}
                  onChange={handleChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              <button
                type="button"
                className="remove-button"
                onClick={() => removeCertification(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-button"
            onClick={addCertification}
          >
            Add Another Certification
          </button>
        </div>
      )}
    </>
  );
};

export default CertificationsSection;