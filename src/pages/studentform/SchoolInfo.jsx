import React from 'react';

const SchoolInfoSection = ({ formData, handleChange }) => {
  return (
    <>
      <div className="form-group">
        <label>School (eg. SOET, SOMC)</label>
        <select
          name="school"
          value={formData.school}
          onChange={handleChange}
          required
        >
          <option value="">Select School</option>
          <option value="SOET">SOET</option>
          <option value="SOMC">SOMC</option>
          <option value="SOMC">SOHS</option>
          <option value="SOMC">SOLS</option>
          <option value="SOMC">SOED</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Existing No. of Backlogs</label>
        <input
          type="number"
          name="existingBacklogs"
          value={formData.existingBacklogs}
          onChange={handleChange}
          required
          min="0"
          step="1"
        />
      </div>
    </>
  );
};

export default SchoolInfoSection;