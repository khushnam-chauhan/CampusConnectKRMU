"use client"

import { useState, useRef, useEffect } from "react"
import "./JobPostForm.css"
import Navbar from "../../layouts/Navbar"

const JobPostForm = () => {
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
    offerType: [], // Changed to array for multiple selections
    ctcOrStipend: "",
    location: "",
    resultDeclaration: "Same day",
    dateOfJoining: "",
    reference: "Self",
    jobDescription: "",
    companyLogo: "",
    additionalInfo: "",
    skills: [], // New field for skills
    category: [], // New field for categories
  })

  const offerTypes = ["Full time Employment", "Internship + PPO", "Apprenticeship", "Summer Internship"]

  // Predefined job categories
  const jobCategories = [
    "Interaction Designer",
    "Network Administrator",
    "User Interface Designer",
    "Social Media Manager",
    "User Experience Designer",
    "Procurement Analyst",
    "Social Media Analyst",
    "Quality Assurance Analyst",
    "SEO Specialist",
    "Executive Assistant",
    "Database Administrator",
    "Procurement Manager",
    "Data Analyst",
    "Backend Developer",
    "Demand Planner",
    "Office Manager",
    "Customer Success Manager",
    "Frontend Developer",
    "Retirement Planner",
    "Account Executive",
    "Inside Sales Representative",
    "UX/UI Designer",
    "Network Security Analyst",
    "Paralegal",
    "Training Coordinator",
    "Event Coordinator",
    "Personal Assistant",
    "Sustainable Design Specialist",
    "Data Scientist",
    "Customer Support Specialist",
    "Systems Administrator",
    "Data Entry Specialist",
    "Manufacturing Engineer",
    "Residential Landscape Designer",
    "Sales Account Manager",
    "IT Project Manager",
    "Portfolio Manager",
    "Content Strategist",
    "Product Marketing Manager",
    "Inventory Manager",
    "Business Intelligence Analyst",
    "Market Researcher",
    "Supply Chain Manager",
    "Water Resources Engineer",
    "Supply Chain Coordinator",
    "DevOps Engineer",
    "Client Relationship Manager",
    "Investment Advisor",
    "Financial Analyst",
    "Wedding Planner",
    "Front-End Developer",
    "Family Law Attorney",
    "Content Creator",
    "Event Planner",
    "Automation Tester",
    "Market Research Analyst",
    "Benefits Coordinator",
    "Research Analyst",
    "Administrative Coordinator",
    "IT Support Specialist",
    "UI/UX Designer",
    "Software Development",
    "Data Science",
    "Product Management",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "Human Resources",
    "Customer Support",
    "Other",
  ].sort()

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  // For managing skill input
  const [skillInput, setSkillInput] = useState("")

  // For category dropdown
  const [categoryInput, setCategoryInput] = useState("")
  const [filteredCategories, setFilteredCategories] = useState([])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const categoryInputRef = useRef(null)
  const dropdownRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  // Handle checkbox changes for offer type
  const handleOfferTypeChange = (e) => {
    const { value, checked } = e.target

    // If checked, add to array; if unchecked, remove from array
    if (checked) {
      setFormData({
        ...formData,
        offerType: [...formData.offerType, value],
      })
    } else {
      setFormData({
        ...formData,
        offerType: formData.offerType.filter((type) => type !== value),
      })
    }

    // Clear error when user makes a selection
    if (errors.offerType) {
      setErrors({ ...errors, offerType: "" })
    }
  }

  // Handle category input change
  const handleCategoryInputChange = (e) => {
    const value = e.target.value
    setCategoryInput(value)

    if (value.trim()) {
      // Filter job categories based on input
      const filtered = jobCategories.filter((category) => category.toLowerCase().includes(value.toLowerCase()))
      setFilteredCategories(filtered)
      setShowCategoryDropdown(true)
    } else {
      setFilteredCategories([])
      setShowCategoryDropdown(false)
    }
  }

  // Add category
  const addCategory = (category) => {
    if (category.trim() && !formData.category.includes(category)) {
      setFormData({
        ...formData,
        category: [...formData.category, category],
      })

      if (errors.category) {
        setErrors({ ...errors, category: "" })
      }
    }
    setCategoryInput("")
    setShowCategoryDropdown(false)
  }

  // Handle adding custom category
  const handleAddCustomCategory = () => {
    if (categoryInput.trim()) {
      addCategory(categoryInput.trim())
    }
  }

  // Handle category selection from dropdown
  const handleSelectCategory = (category) => {
    addCategory(category)
  }

  // Handle category input keydown
  const handleCategoryInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCustomCategory()
    }
  }

  // Remove a category
  const removeCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      category: formData.category.filter((cat) => cat !== categoryToRemove),
    })
  }

  // Handle skill input change - now processes comma-separated skills
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value)
  }

  // Add skills - processes comma-separated input
  const handleAddSkills = () => {
    if (skillInput.trim()) {
      // Split by comma and trim whitespace from each skill
      const newSkills = skillInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)

      // Filter out duplicates and add to current skills
      const uniqueNewSkills = newSkills.filter((skill) => !formData.skills.includes(skill))

      if (uniqueNewSkills.length > 0) {
        const updatedSkills = [...formData.skills, ...uniqueNewSkills]
        setFormData({ ...formData, skills: updatedSkills })

        if (errors.skills) {
          setErrors({ ...errors, skills: "" })
        }
      }

      setSkillInput("")
    }
  }

  // Handle skill input keydown - now for comma-separated skills
  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkills()
    }
  }

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = [
      "companyName",
      "officeAddress",
      "website",
      "yearOfEstablishment",
      "contactPersonName",
      "contactNumber",
      "email",
      "profiles",
      "eligibility",
      "vacancies",
      "ctcOrStipend",
      "location",
      "resultDeclaration",
      "dateOfJoining",
      "reference",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required"
      }
    })

    // Validate offerType separately since it's an array
    if (formData.offerType.length === 0) {
      newErrors.offerType = "Please select at least one offer type"
    }

    // Validate skills
    if (formData.skills.length === 0) {
      newErrors.skills = "Please add at least one skill"
    }

    // Validate category
    if (formData.category.length === 0) {
      newErrors.category = "Please select at least one category"
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (
      formData.yearOfEstablishment &&
      (isNaN(formData.yearOfEstablishment) ||
        formData.yearOfEstablishment < 1800 ||
        formData.yearOfEstablishment > new Date().getFullYear())
    ) {
      newErrors.yearOfEstablishment = "Please enter a valid year"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (skillInput.trim()) {
      const newSkills = skillInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
      const uniqueNewSkills = newSkills.filter((skill) => !formData.skills.includes(skill));
      if (uniqueNewSkills.length > 0) {
        formData.skills = [...formData.skills, ...uniqueNewSkills];
      }
      setSkillInput("");
    }
  
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
    setSubmitMessage("");
  
    try {
      const processedData = {
        companyName: formData.companyName,
        officeAddress: formData.officeAddress,
        website: formData.website,
        yearOfEstablishment: Number.parseInt(formData.yearOfEstablishment),
        contactPersonName: formData.contactPersonName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        profiles: formData.profiles,
        eligibility: formData.eligibility,
        vacancies: Number.parseInt(formData.vacancies),
        offerType: formData.offerType, // Array, e.g., ["Full time Employment", "Internship + PPO"]
        ctcOrStipend: formData.ctcOrStipend,
        location: formData.location,
        resultDeclaration: formData.resultDeclaration,
        dateOfJoining: formData.dateOfJoining,
        reference: formData.reference,
        jobDescription: formData.jobDescription,
        companyLogo: formData.companyLogo,
        additionalInfo: formData.additionalInfo,
        skills: formData.skills,
        category: formData.category,
      };
  
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSubmitMessage("Job posting submitted successfully and awaiting admin approval");
        setFormData({
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
          offerType: [], // Reset to empty array
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
        setSkillInput("");
        setCategoryInput("");
      } else {
        throw new Error(result.message || "Failed to submit job posting");
      }
    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="job-post-form-container">
        <h2>Post a New Job</h2>
        <p className="form-notice">All job postings require admin approval before being displayed publicly.</p>

        {submitMessage && (
          <div className={`form-message ${submitMessage.includes("Error") ? "error" : "success"}`}>{submitMessage}</div>
        )}

        <form className="job-post-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Company Information</h3>

            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={errors.companyName ? "error" : ""}
              />
              {errors.companyName && <span className="error-message">{errors.companyName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="officeAddress">Office Address *</label>
              <input
                type="text"
                id="officeAddress"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                className={errors.officeAddress ? "error" : ""}
              />
              {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Company Website *</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={errors.website ? "error" : ""}
                  placeholder="https://example.com"
                />
                {errors.website && <span className="error-message">{errors.website}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="yearOfEstablishment">Year of Establishment *</label>
                <input
                  type="number"
                  id="yearOfEstablishment"
                  name="yearOfEstablishment"
                  value={formData.yearOfEstablishment}
                  onChange={handleChange}
                  className={errors.yearOfEstablishment ? "error" : ""}
                  min="1800"
                  max={new Date().getFullYear()}
                />
                {errors.yearOfEstablishment && <span className="error-message">{errors.yearOfEstablishment}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="companyLogo">Company Logo URL</label>
              <input
                type="text"
                id="companyLogo"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>

            <div className="form-group">
              <label htmlFor="contactPersonName">Contact Person Name *</label>
              <input
                type="text"
                id="contactPersonName"
                name="contactPersonName"
                value={formData.contactPersonName}
                onChange={handleChange}
                className={errors.contactPersonName ? "error" : ""}
              />
              {errors.contactPersonName && <span className="error-message">{errors.contactPersonName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number *</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={errors.contactNumber ? "error" : ""}
                />
                {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reference">Reference *</label>
              <select
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className={errors.reference ? "error" : ""}
              >
                <option value="Self">Self</option>
                <option value="Dr. Vibha Thakur">Dr. Vibha Thakur</option>
                <option value="Ms. Shruti Bansal">Ms. Shruti Bansal</option>
                <option value="Ms. Mansi Shrivastava">Ms. Mansi Shrivastava</option>
                <option value="Ms. Charu Gola">Ms. Charu Gola</option>
              </select>
              {errors.reference && <span className="error-message">{errors.reference}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Job Details</h3>

            <div className="form-group">
              <label htmlFor="profiles">Job Profiles *</label>
              <input
                type="text"
                id="profiles"
                name="profiles"
                value={formData.profiles}
                onChange={handleChange}
                className={errors.profiles ? "error" : ""}
                placeholder="e.g. Software Engineer, Data Analyst"
              />
              {errors.profiles && <span className="error-message">{errors.profiles}</span>}
            </div>

            <div className="form-group">
              <label>Offer Type *</label>
              <div className="checkbox-group">
                {offerTypes.map((type) => (
                  <div key={type} className="checkbox-item">
                    <label htmlFor={`offerType-${type}`}>{type}</label>
                    <input
                      type="checkbox"
                      id={`offerType-${type}`}
                      name="offerType"
                      value={type}
                      checked={formData.offerType.includes(type)}
                      onChange={handleOfferTypeChange}
                    />
                  </div>
                ))}
              </div>
              {errors.offerType && <span className="error-message">{errors.offerType}</span>}
            </div>

            {/* New Job Categories Searchable Dropdown */}
            <div className="form-group">
              <label htmlFor="category">Job Categories *</label>
              <div className="category-input-container">
                <div className="category-input-wrapper">
                  <input
                    type="text"
                    id="category"
                    ref={categoryInputRef}
                    value={categoryInput}
                    onChange={handleCategoryInputChange}
                    onKeyDown={handleCategoryInputKeyDown}
                    placeholder="Search for categories or add custom ones"
                    className={errors.category ? "error" : ""}
                  />
                  <button type="button" className="add-category-btn" onClick={handleAddCustomCategory}>
                    Add
                  </button>
                </div>

                {showCategoryDropdown && filteredCategories.length > 0 && (
                  <div className="category-dropdown" ref={dropdownRef}>
                    {filteredCategories.map((category, index) => (
                      <div
                        key={index}
                        className="category-dropdown-item"
                        onClick={() => handleSelectCategory(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}

                <div className="category-tags">
                  {formData.category.map((category, index) => (
                    <div key={index} className="category-tag">
                      {category}
                      <button type="button" className="remove-category" onClick={() => removeCategory(category)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            {/* Modified Skills Field to accept comma-separated input */}
            <div className="form-group">
              <label htmlFor="skills">Required Skills *</label>
              <div className="skills-input-container">
                <div className="skills-input-wrapper">
                  <input
                    type="text"
                    id="skills"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onKeyDown={handleSkillInputKeyDown}
                    placeholder="Type skills and press Enter (e.g. React, JavaScript)"
                    className={errors.skills ? "error" : ""}
                  />
                  
                </div>

                {/* Show skills inside the input field */}
                <div className="skills-list">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                      {skill}
                      <button type="button" className="remove-skill" onClick={() => removeSkill(skill)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {errors.skills && <span className="error-message">{errors.skills}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? "error" : ""}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vacancies">Number of Vacancies *</label>
                <input
                  type="number"
                  id="vacancies"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className={errors.vacancies ? "error" : ""}
                  min="1"
                />
                {errors.vacancies && <span className="error-message">{errors.vacancies}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="ctcOrStipend">CTC/Stipend *</label>
                <input
                  type="text"
                  id="ctcOrStipend"
                  name="ctcOrStipend"
                  value={formData.ctcOrStipend}
                  onChange={handleChange}
                  className={errors.ctcOrStipend ? "error" : ""}
                  placeholder="e.g. 8-10 LPA or 15,000/month"
                />
                {errors.ctcOrStipend && <span className="error-message">{errors.ctcOrStipend}</span>}
              </div>
            </div>

            <div className="form-row">
            <div className="form-group">
  <label htmlFor="resultDeclaration">Result Declaration *</label>
  <select
    id="resultDeclaration"
    name="resultDeclaration"
    value={formData.resultDeclaration}
    onChange={handleChange}
    className={errors.resultDeclaration ? "error" : ""}
  >
    <option value="Same day">Same day</option>
    <option value="Within a week">Within a week</option>
    <option value="Within a week">Within a month</option>
    <option value="Within a week">After a month</option>
  </select>
  {errors.resultDeclaration && <span className="error-message">{errors.resultDeclaration}</span>}
</div>

              <div className="form-group">
                <label htmlFor="dateOfJoining">Date of Joining *</label>
                <input
                  type="date"
                  id="dateOfJoining"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  className={errors.dateOfJoining ? "error" : ""}
                />
                {errors.dateOfJoining && <span className="error-message">{errors.dateOfJoining}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="eligibility">Eligibility Criteria *</label>
              <textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                className={errors.eligibility ? "error" : ""}
                rows="3"
              ></textarea>
              {errors.eligibility && <span className="error-message">{errors.eligibility}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows="6"
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>

            <div className="form-group">
              <label htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any additional information that might be relevant"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Job Posting"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default JobPostForm

