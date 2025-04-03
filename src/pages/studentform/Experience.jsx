import React from 'react';

const ExperienceSection = ({ experiences, handleChange, addExperience, removeExperience }) => {
  return (
    <div className="form-section">
      <h3>Work Experience</h3>
      
      {experiences.map((experience, index) => (
        <div key={index} className="experience-item">
          {index === 0 && (
            <div className="form-group">
              <label>Do you have any experience?</label>
              <div className="checkbox-container">
                <label htmlFor={`hasExperience-${index}`}>Yes</label>
                <input
                  type="checkbox"
                  name={`experience-${index}-hasExperience`}
                  checked={experience.hasExperience}
                  onChange={(e) => handleChange(index, 'hasExperience', e.target.checked)}
                  id={`hasExperience-${index}`}
                />
              </div>
            </div>
          )}

          {(index > 0 || experience.hasExperience) && (
            <div className="experience-container">
              {index > 0 && <hr className="experience-divider" />}
              <div className="experience-header">
                <h4>Experience {index + 1}</h4>
                {index > 0 && (
                  <button 
                    type="button" 
                    className="remove-button"
                    onClick={() => removeExperience(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  name={`experience-${index}-organizationName`}
                  value={experience.organizationName || ''}
                  onChange={(e) => handleChange(index, 'organizationName', e.target.value)}
                  required={experience.hasExperience}
                />
              </div>
              
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name={`experience-${index}-duration`}
                  value={experience.duration || ''}
                  onChange={(e) => handleChange(index, 'duration', e.target.value)}
                  placeholder="e.g., 6 months, 2 years"
                  required={experience.hasExperience}
                />
              </div>
              
              <div className="form-group">
                <label>Details</label>
                <textarea
                  name={`experience-${index}-details`}
                  value={experience.details || ''}
                  onChange={(e) => handleChange(index, 'details', e.target.value)}
                  placeholder="Describe your role and responsibilities"
                  rows="4"
                  required={experience.hasExperience}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {experiences[0].hasExperience && (
        <button 
          type="button" 
          className="add-button"
          onClick={addExperience}
        >
          Add Another Experience
        </button>
      )}
    </div>
  );
};

export default ExperienceSection;