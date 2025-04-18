"use client"

import { useState, useEffect } from "react"
import "./AdminEmailBulk.css"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const AdminEmailBulk = ({ fetchUserGroups, fetchEmailTemplates, saveTemplate, sendBulkEmail }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [recipients, setRecipients] = useState([])
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [subject, setSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [attachments, setAttachments] = useState([])

  // Template management
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [templateName, setTemplateName] = useState("")

  // Filter options
  const [userRoles, setUserRoles] = useState([])
  const [schools, setSchools] = useState([])

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRecipients, setFilteredRecipients] = useState([])

  // Selection filters
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedSchool, setSelectedSchool] = useState("all")
  const [individualMode, setIndividualMode] = useState(false)

  // Progress tracking
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)

  // Settings
  const [scheduleSend, setScheduleSend] = useState(false)
  const [scheduledDateTime, setScheduledDateTime] = useState("")
  const [trackOpens, setTrackOpens] = useState(true)

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  }

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        // Fetch user groups, roles, and schools
        const userGroupsData = await fetchUserGroups()

        // Improved validation of the response structure
        if (!userGroupsData) {
          setError("No data received from the server. Please check your API endpoint.")
          setLoading(false)
          return
        }

        // Check if the response has the expected structure
        if (!userGroupsData.users || !Array.isArray(userGroupsData.users)) {
          console.error("Invalid user groups data format:", userGroupsData)
          setError("Received invalid data structure from the server. Expected an object with a 'users' array.")
          setLoading(false)
          return
        }

        // Filter out any invalid user entries
        const validUsers = userGroupsData.users.filter((user) => user && typeof user === "object")

        // Extract unique roles and schools from user groups
        const roles = [...new Set(validUsers.filter((user) => user.role).map((user) => user.role))]
        const schoolList = [...new Set(validUsers.filter((user) => user.school).map((user) => user.school))]

        setUserRoles(roles)
        setSchools(schoolList)
        setRecipients(validUsers)
        setFilteredRecipients(validUsers)

        // Fetch email templates
        const templatesData = await fetchEmailTemplates()

        // Check if templates data is valid
        if (templatesData && templatesData.templates) {
          setTemplates(templatesData.templates)
        } else {
          console.warn("No templates found or invalid templates data:", templatesData)
          setTemplates([])
        }

        setError(null)
      } catch (err) {
        console.error("Error loading email data:", err)
        setError(`Failed to load email data: ${err.message || "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [fetchUserGroups, fetchEmailTemplates])

  // Filter recipients when selection criteria changes or search term changes
  useEffect(() => {
    if (!recipients.length) return

    let filtered = [...recipients]

    // Filter by role if not "all"
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user && user.role === selectedRole)
    }

  

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          (user.fullName && user.fullName.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term)) ||
          (user.rollNo && user.rollNo.toLowerCase().includes(term))
      )
    }

    setFilteredRecipients(filtered)
    
    // Only update selected recipients if not in individual mode
    if (!individualMode) {
      setSelectedRecipients(filtered)
    }
  }, [selectedRole, selectedSchool, searchTerm, recipients, individualMode])

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value
    if (templateId === "none") {
      setSelectedTemplate(null)
      setSubject("")
      setEmailContent("")
      return
    }

    const template = templates.find((t) => t._id === templateId)
    if (template) {
      setSelectedTemplate(template)
      setSubject(template.subject || "")
      setEmailContent(template.content || "")
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setAttachments([...attachments, ...files])
  }

  const removeAttachment = (index) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  const handleRecipientSelection = (userId) => {
    if (individualMode) {
      const updatedRecipients = [...selectedRecipients]
      const index = updatedRecipients.findIndex((r) => r._id === userId)

      if (index >= 0) {
        updatedRecipients.splice(index, 1)
      } else {
        const user = recipients.find((r) => r._id === userId)
        if (user) {
          updatedRecipients.push(user)
        }
      }

      setSelectedRecipients(updatedRecipients)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setError("Please enter a template name")
      return
    }

    try {
      setLoading(true)
      const templateData = {
        name: templateName,
        subject,
        content: emailContent,
      }

      await saveTemplate(templateData)

      // Refresh templates list
      const templatesData = await fetchEmailTemplates()
      if (templatesData && templatesData.templates) {
        setTemplates(templatesData.templates)
      }

      setSaveAsTemplate(false)
      setTemplateName("")
      setSuccess("Template saved successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError(`Failed to save template: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (selectedRecipients.length === 0) {
      setError("Please select at least one recipient")
      return
    }

    if (!subject.trim()) {
      setError("Please enter a subject")
      return
    }

    if (!emailContent.trim()) {
      setError("Please enter email content")
      return
    }

    try {
      setSending(true)
      setProgress(0)
      setError(null)

      // Create form data for the email
      const formData = new FormData()
      formData.append("subject", subject)
      formData.append("content", emailContent)
      formData.append("trackOpens", trackOpens)

      // Add recipient IDs
      const recipientIds = selectedRecipients.map((r) => r._id)
      formData.append("recipients", JSON.stringify(recipientIds))

      // Add scheduled date if applicable
      if (scheduleSend && scheduledDateTime) {
        formData.append("scheduledDateTime", scheduledDateTime)
      }

      // Add attachments
      attachments.forEach((file) => {
        formData.append("attachments", file)
      })

      // Save template if needed
      if (saveAsTemplate && templateName.trim()) {
        const templateData = {
          name: templateName,
          subject,
          content: emailContent,
        }
        await saveTemplate(templateData)
      }

      // Simulated progress for UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) clearInterval(progressInterval)
          return Math.min(prev + 10, 90)
        })
      }, 300)

      // Send the email
      const result = await sendBulkEmail(formData)

      clearInterval(progressInterval)
      setProgress(100)

      setSuccess(`Email sent successfully to ${selectedRecipients.length} recipients`)

      // Reset form after successful send
      setTimeout(() => {
        setSubject("")
        setEmailContent("")
        setAttachments([])
        setSelectedTemplate(null)
        setSaveAsTemplate(false)
        setTemplateName("")
        setScheduleSend(false)
        setScheduledDateTime("")
        setSending(false)
        setProgress(0)
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setSending(false)
      setProgress(0)
      setError(`Failed to send email: ${err.message || "Unknown error"}`)
    }
  }

  return (
    <div className="admin-bulk-email">
      <h2>Bulk Email System</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <div className="loading">Loading email system...</div>
      ) : (
        <div className="email-container">
          <div className="email-sidebar">
            <div className="recipient-filters">
              <h3>Select Recipients</h3>

              <div className="search-bar">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email or roll number..."
                  className="search-input"
                />
              </div>

              <div className="filter-group">
                <label>Filter by Role:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={individualMode}
                >
                  <option value="all">All Roles</option>
                  {userRoles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

             
              <div className="filter-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={individualMode}
                    onChange={() => {
                      setIndividualMode(!individualMode)
                      if (!individualMode) {
                        setSelectedRole("all")
                        setSelectedSchool("all")
                        setSelectedRecipients([])
                      }
                    }}
                  />
                  Select Individual Recipients
                </label>
              </div>
            </div>

            <div className="recipient-list">
              <h4>Recipients ({selectedRecipients.length})</h4>
              {individualMode ? (
                <div className="individual-recipients">
                  {filteredRecipients.map((user) => (
                    <div
                      key={user._id}
                      className={`recipient-item ${selectedRecipients.some((r) => r._id === user._id) ? "selected" : ""}`}
                      onClick={() => handleRecipientSelection(user._id)}
                    >
                      <div className="recipient-info">
                        <div className="recipient-name">{user.fullName}</div>
                        <div className="recipient-email">{user.email}</div>
                        <div className="recipient-meta">
                          <span className="role">{user.role}</span>
                          {user.school && <span className="school">{user.school}</span>}
                          {user.rollNo && <span className="roll-no">#{user.rollNo}</span>}
                        </div>
                      </div>
                      <div className="recipient-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedRecipients.some((r) => r._id === user._id)}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="group-recipients">
                  <div className="recipient-summary">
                    <div>
                      Total Recipients: <strong>{selectedRecipients.length}</strong>
                    </div>
                    {selectedRole !== "all" && (
                      <div>
                        Role: <strong>{selectedRole}</strong>
                      </div>
                    )}
                    {selectedSchool !== "all" && (
                      <div>
                        School: <strong>{selectedSchool}</strong>
                      </div>
                    )}
                    {searchTerm && (
                      <div>
                        Search: <strong>{searchTerm}</strong>
                      </div>
                    )}
                  </div>

                  <div className="recipient-preview">
                    {selectedRecipients.slice(0, 5).map((user) => (
                      <div key={user._id} className="recipient-item">
                        <div className="recipient-info">
                          <div className="recipient-name">{user.fullName}</div>
                          <div className="recipient-email">{user.email}</div>
                          {user.rollNo && <div className="recipient-roll">#{user.rollNo}</div>}
                        </div>
                      </div>
                    ))}
                    {selectedRecipients.length > 5 && (
                      <div className="more-recipients">+ {selectedRecipients.length - 5} more recipients</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="email-composer">
            <div className="template-selector">
              <label>Choose Template:</label>
              <select onChange={handleTemplateSelect} value={selectedTemplate?._id || "none"}>
                <option value="none">No Template</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="email-subject">
              <label>Subject:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>

            <div className="email-content">
              <label>Email Content:</label>
              <ReactQuill
                value={emailContent}
                onChange={setEmailContent}
                modules={modules}
                placeholder="Compose your email..."
              />
            </div>

            <div className="email-attachments">
              <label>Attachments:</label>
              <input type="file" multiple onChange={handleFileChange} className="attachment-input" />

              {attachments.length > 0 && (
                <div className="attachment-list">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeAttachment(index)} className="remove-attachment">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="email-options">
              <div className="option-group">
                <label>
                  <input type="checkbox" checked={saveAsTemplate} onChange={() => setSaveAsTemplate(!saveAsTemplate)} />
                  Save as Template
                </label>

                {saveAsTemplate && (
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Template Name"
                    className="template-name-input"
                  />
                )}
              </div>

              <div className="option-group">
                <label>
                  <input type="checkbox" checked={scheduleSend} onChange={() => setScheduleSend(!scheduleSend)} />
                  Schedule Send
                </label>

                {scheduleSend && (
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="schedule-datetime-input"
                  />
                )}
              </div>

              <div className="option-group">
                <label>
                  <input type="checkbox" checked={trackOpens} onChange={() => setTrackOpens(!trackOpens)} />
                  Track Email Opens
                </label>
              </div>
            </div>

            <div className="email-actions">
              {saveAsTemplate && (
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="save-template-button"
                  disabled={sending || !templateName.trim()}
                >
                  Save Template
                </button>
              )}

              <button
                type="button"
                onClick={handleSendEmail}
                className="send-email-button"
                disabled={sending || selectedRecipients.length === 0 || !subject.trim() || !emailContent.trim()}
              >
                {sending ? "Sending..." : scheduleSend ? "Schedule Email" : "Send Email"}
              </button>
            </div>

            {sending && (
              <div className="sending-progress">
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-text">{progress}% Complete</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEmailBulk