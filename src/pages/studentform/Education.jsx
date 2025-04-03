import React from "react";

const EducationSection = ({ formData, handleChange }) => {
  // Ensure education fields are always defined
  const education = {
    tenth: {
      percentage: formData.education.tenth.percentage ?? "",
      passingYear: formData.education.tenth.passingYear ?? "",
    },
    twelfth: {
      percentage: formData.education.twelfth.percentage ?? "",
      passingYear: formData.education.twelfth.passingYear ?? "",
    },
    graduation: {
      degree: formData.education.graduation.degree ?? "",
      percentageOrCGPA: formData.education.graduation.percentageOrCGPA ?? "",
      passingYear: formData.education.graduation.passingYear ?? "",
    },
    masters: {
      degree: formData.education.masters.degree ?? "",
      percentageOrCGPA: formData.education.masters.percentageOrCGPA ?? "",
      passingYear: formData.education.masters.passingYear ?? "",
    },
  };

  // Helper function to validate percentage input
  const validatePercentage = (e) => {
    const value = e.target.value;
    if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
      handleChange(e);
    }
  };

  return (
    <>
      <div className="form-group">
        <label>10th % / CGPA</label>
        <input
          type="text"
          name="education.tenth.percentage"
          value={education.tenth.percentage}
          onChange={validatePercentage}
          required
          min="0"
          max="100"
          title="Percentage must be between 0 and 100"
        />
      </div>

      <div className="form-group">
        <label>10th Year of Passing</label>
        <input
          type="text"
          name="education.tenth.passingYear"
          value={education.tenth.passingYear}
          onChange={handleChange}
          required
          pattern="^\d{4}$"
          title="Please enter a valid 4-digit year"
        />
      </div>

      <div className="form-group">
        <label>12th %</label>
        <input
          type="text"
          name="education.twelfth.percentage"
          value={education.twelfth.percentage}
          onChange={validatePercentage}
          required
          min="0"
          max="100"
          title="Percentage must be between 0 and 100"
        />
      </div>

      <div className="form-group">
        <label>12th Year of Passing</label>
        <input
          type="text"
          name="education.twelfth.passingYear"
          value={education.twelfth.passingYear}
          onChange={handleChange}
          required
          pattern="^\d{4}$"
          title="Please enter a valid 4-digit year"
        />
      </div>

      <div className="form-group">
        <label>Graduation Degree</label>
        <input
          type="text"
          name="education.graduation.degree"
          value={education.graduation.degree}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Graduation % or CGPA</label>
        <input
          type="text"
          name="education.graduation.percentageOrCGPA"
          value={education.graduation.percentageOrCGPA}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Graduation Year of Passing</label>
        <input
          type="text"
          name="education.graduation.passingYear"
          value={education.graduation.passingYear}
          onChange={handleChange}
          pattern="^\d{4}$|^$"
          title="Please enter a valid 4-digit year or leave blank"
        />
      </div>

      <div className="form-group">
        <label>Master's Degree</label>
        <input
          type="text"
          name="education.masters.degree"
          value={education.masters.degree}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Master's % or CGPA</label>
        <input
          type="text"
          name="education.masters.percentageOrCGPA"
          value={education.masters.percentageOrCGPA}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Master's Year of Passing</label>
        <input
          type="text"
          name="education.masters.passingYear"
          value={education.masters.passingYear}
          onChange={handleChange}
          pattern="^\d{4}$|^$"
          title="Please enter a valid 4-digit year or leave blank"
        />
      </div>
    </>
  );
};

export default EducationSection;