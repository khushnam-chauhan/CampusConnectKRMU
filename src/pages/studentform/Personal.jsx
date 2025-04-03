import React from 'react';

const PersonalInfoSection = ({ formData, handleChange }) => {
  return (
    <>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Roll No.</label>
        <input
          type="text"
          name="rollNo"
          value={formData.rollNo}
          onChange={handleChange}
          required
          readOnly
        />
      </div>

      <div className="form-group">
        <label>Mobile No.</label>
        <input
          type="text"
          name="mobileNo"
          value={formData.mobileNo}
          onChange={handleChange}
          required
          pattern="^\d{10}$"
          title="Please enter a 10-digit mobile number"
        />
      </div>

      <div className="form-group">
        <label>WhatsApp No.</label>
        <input
          type="text"
          name="whatsappNo"
          value={formData.whatsappNo}
          onChange={handleChange}
          required
          pattern="^\d{10}$"
          title="Please enter a 10-digit WhatsApp number"
        />
      </div>

      <div className="form-group">
        <label>Father's Name</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Father's Mobile No.</label>
        <input
          type="text"
          name="fatherNumber"
          value={formData.fatherNumber}
          onChange={handleChange}
          required
          pattern="^\d{10}$"
          title="Please enter a 10-digit mobile number"
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;