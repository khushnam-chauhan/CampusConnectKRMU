import React, { useState, useEffect, useRef } from "react";
import "./AdminJobForm.css";

const AdminJobForm = ({ formMode, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    officeAddress: "",
    website: "",
    yearOfEstablishment: "",
    contactPersonName: "",
    contactNumber: "",
    email: "",
    profiles: "",
    eligibility: "",
    vacancies: 1,
    offerType: [],
    ctcOrStipend: "",
    location: "",
    resultDeclaration: "Same day",
    dateOfJoining: "",
    reference: "Self",
    jobDescription: "",
    companyLogo: "",
    additionalInfo: "",
    skills: [],
    category: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const jobCategories = [
    "Interaction Designer", "Network Administrator", "User Interface Designer", /* ...rest from JobPostForm */ "Other"
  ].sort();

  useEffect(() => {
    if (initialData && formMode === "edit") {
      setFormData({ ...initialData });
    }
  }, [initialData, formMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOfferTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      offerType: checked ? [...prev.offerType, value] : prev.offerType.filter((type) => type !== value),
    }));
  };

  const handleSkillInputChange = (e) => setSkillInput(e.target.value);

  const handleAddSkills = () => {
    if (skillInput.trim()) {
      const newSkills = skillInput.split(",").map((skill) => skill.trim()).filter((skill) => skill);
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, ...newSkills.filter((skill) => !prev.skills.includes(skill))],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);
    if (value.trim()) {
      const filtered = jobCategories.filter((cat) => cat.toLowerCase().includes(value.toLowerCase()));
      setFilteredCategories(filtered);
      setShowCategoryDropdown(true);
    } else {
      setShowCategoryDropdown(false);
    }
  };

  const addCategory = (category) => {
    if (category.trim() && !formData.category.includes(category)) {
      setFormData((prev) => ({ ...prev, category: [...prev.category, category] }));
    }
    setCategoryInput("");
    setShowCategoryDropdown(false);
  };

  const removeCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.filter((c) => c !== category),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (skillInput.trim()) handleAddSkills();
    onSubmit(formData);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        categoryInputRef.current && !categoryInputRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="job-description__body2">
      <div className="jd-layout">
        <div className="job-description__details2">
          <div className="job-info2">
            <span>Company Name:</span>
            <input name="companyName" value={formData.companyName} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Office Address:</span>
            <input name="officeAddress" value={formData.officeAddress} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Website:</span>
            <input name="website" value={formData.website} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Year of Establishment:</span>
            <input name="yearOfEstablishment" value={formData.yearOfEstablishment} onChange={handleChange} type="number" />
          </div>
        </div>
        <div className="job-description__details2">
          <div className="job-info2">
            <span>Contact Person:</span>
            <input name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Contact Number:</span>
            <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Email:</span>
            <input name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Company Logo URL:</span>
            <input name="companyLogo" value={formData.companyLogo} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="jd-layout">
        <div className="job-description__details2">
          <div className="job-info2">
            <span>CTC/Stipend:</span>
            <input name="ctcOrStipend" value={formData.ctcOrStipend} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Location:</span>
            <input name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="job-info2">
            <span>Vacancies:</span>
            <input name="vacancies" value={formData.vacancies} onChange={handleChange} type="number" />
          </div>
        </div>
        <div className="job-description__details2">
          <div className="job-info2">
            <span>Result Declaration:</span>
            <select name="resultDeclaration" value={formData.resultDeclaration} onChange={handleChange}>
              <option value="Same day">Same day</option>
              <option value="Within a week">Within a week</option>
            </select>
          </div>
          <div className="job-info2">
            <span>Date of Joining:</span>
            <input name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} type="date" />
          </div>
          <div className="job-info2">
            <span>Reference:</span>
            <select name="reference" value={formData.reference} onChange={handleChange}>
              <option value="Self">Self</option>
              <option value="Dr. Vibha Thakur">Dr. Vibha Thakur</option>
              <option value="Ms. Shruti Bansal">Ms. Shruti Bansal</option>
              <option value="Ms. Mansi Shrivastava">Ms. Mansi Shrivastava</option>
              <option value="Ms. Charu Gola">Ms. Charu Gola</option>
            </select>
          </div>
        </div>
      </div>
      <h2>Job Profile</h2>
      <input name="profiles" value={formData.profiles} onChange={handleChange} placeholder="e.g. Software Engineer" />
      <h2>Offer Type</h2>
      <div className="checkbox-group">
        {["Full time Employment", "Internship + PPO", "Apprenticeship", "Summer Internship"].map((type) => (
          <label key={type} className="checkbox-label">
            <input
              type="checkbox"
              value={type}
              checked={formData.offerType.includes(type)}
              onChange={handleOfferTypeChange}
            />
            {type}
          </label>
        ))}
      </div>
      <h2>Skills Required</h2>
      <div className="skills-input-container">
        <input
          value={skillInput}
          onChange={handleSkillInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleAddSkills()}
          placeholder="Type skills and press Enter or comma"
        />
        <div className="job-description__skills2">
          {formData.skills.map((skill, index) => (
            <span key={index} className="job-description__skill-tag2">
              {skill}
              <button type="button" className="remove-skill" onClick={() => removeSkill(skill)}>×</button>
            </span>
          ))}
        </div>
      </div>
      <h2>Categories</h2>
      <div className="category-input-container">
        <div className="category-input-wrapper">
          <input
            ref={categoryInputRef}
            value={categoryInput}
            onChange={handleCategoryInputChange}
            placeholder="Search or add categories"
          />
          <button type="button" className="add-category-btn" onClick={() => addCategory(categoryInput)}>Add</button>
        </div>
        {showCategoryDropdown && filteredCategories.length > 0 && (
          <div className="category-dropdown" ref={dropdownRef}>
            {filteredCategories.map((cat, index) => (
              <div key={index} className="category-dropdown-item" onClick={() => addCategory(cat)}>{cat}</div>
            ))}
          </div>
        )}
        <div className="job-description__skills2">
          {formData.category.map((cat, index) => (
            <span key={index} className="job-description__skill-tag2">
              {cat}
              <button type="button" className="remove-skill" onClick={() => removeCategory(cat)}>×</button>
            </span>
          ))}
        </div>
      </div>
      <h2>Eligibility Criteria</h2>
      <textarea name="eligibility" value={formData.eligibility} onChange={handleChange} rows="4" />
      <h2>Job Description</h2>
      <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} rows="6" />
      <h2>Additional Information</h2>
      <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="4" />
      <div className="job-description__footer">
        <button type="button" className="job-description__apply-btn" onClick={handleSubmit}>
          {formMode === "create" ? "Create Job" : "Update Job"}
        </button>
        <button type="button" className="job-description__close-details-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminJobForm;