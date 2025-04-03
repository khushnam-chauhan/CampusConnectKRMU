import React, { useState, useEffect } from 'react';
import './AdminBulkEmail.css';

const AdminBulkEmail = ({ fetchUserGroups, fetchEmailTemplates, saveTemplate, sendBulkEmail }) => {
  const [recipients, setRecipients] = useState({
    type: 'role',
    roles: ['student'],
    departments: [],
    years: [],
    customList: []
  });
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: '',
    template: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [sendingStatus, setSendingStatus] = useState(null);
  const [userGroups, setUserGroups] = useState({
    roles: [],
    departments: [],
    years: []
  });
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [saveTemplateMode, setSaveTemplateMode] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimatedRecipientsCount, setEstimatedRecipientsCount] = useState(0);

  useEffect(() => {
    loadUserGroups();
    loadEmailTemplates();
  }, []);

  const loadUserGroups = async () => {
    setLoading(true);
    try {
      const response = await fetchUserGroups();
      setUserGroups(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load user groups. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadEmailTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetchEmailTemplates();
      setEmailTemplates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load email templates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (role) => {
    if (recipients.roles.includes(role)) {
      setRecipients({
        ...recipients,
        roles: recipients.roles.filter(r => r !== role)
      });
    } else {
      setRecipients({
        ...recipients,
        roles: [...recipients.roles, role]
      });
    }
  };

  const handleDepartmentToggle = (department) => {
    if (recipients.departments.includes(department)) {
      setRecipients({
        ...recipients,
        departments: recipients.departments.filter(d => d !== department)
      });
    } else {
      setRecipients({
        ...recipients,
        departments: [...recipients.departments, department]
      });
    }
  };

  const handleYearToggle = (year) => {
    if (recipients.years.includes(year)) {
      setRecipients({
        ...recipients,
        years: recipients.years.filter(y => y !== year)
      });
    } else {
      setRecipients({
        ...recipients,
        years: [...recipients.years, year]
      });
    }
  };

  const handleCustomListChange = (e) => {
    const emails = e.target.value
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    setRecipients({
      ...recipients,
      customList: emails
    });
  };

  const handleRecipientTypeChange = (type) => {
    setRecipients({
      ...recipients,
      type
    });
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    if (!templateId) {
      return;
    }

    const selectedTemplate = emailTemplates.find(template => template._id === templateId);
    if (selectedTemplate) {
      setEmailContent({
        ...emailContent,
        template: templateId,
        subject: selectedTemplate.subject,
        body: selectedTemplate.body
      });
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      setError('Please enter a template name');
      return;
    }

    try {
      await saveTemplate({
        name: templateName,
        subject: emailContent.subject,
        body: emailContent.body
      });
      
      // Refresh templates list
      await loadEmailTemplates();
      
      setSaveTemplateMode(false);
      setTemplateName('');
      setError(null);
    } catch (err) {
      setError('Failed to save template. Please try again.');
      console.error(err);
    }
  };

  const handleAttachmentAdd = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
    e.target.value = null; // Reset input
  };

  const handleAttachmentRemove = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const validateForm = () => {
    if (!emailContent.subject.trim()) {
      setError('Subject is required');
      return false;
    }

    if (!emailContent.body.trim()) {
      setError('Email body is required');
      return false;
    }

    if (recipients.type === 'role' && recipients.roles.length === 0) {
      setError('Please select at least one role');
      return false;
    }

    if (recipients.type === 'department' && recipients.departments.length === 0) {
      setError('Please select at least one department');
      return false;
    }

    if (recipients.type === 'year' && recipients.years.length === 0) {
      setError('Please select at least one year');
      return false;
    }

    if (recipients.type === 'custom' && recipients.customList.length === 0) {
      setError('Please enter at least one email address');
      return false;
    }

    return true;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) {
      return;
    }

    if (!window.confirm(`Are you sure you want to send this email to approximately ${estimatedRecipientsCount} recipients?`)) {
      return;
    }

    setSendingStatus('sending');
    try {
      const formData = new FormData();
      formData.append('recipientType', recipients.type);
      
      if (recipients.type === 'role') {
        formData.append('roles', JSON.stringify(recipients.roles));
      } else if (recipients.type === 'department') {
        formData.append('departments', JSON.stringify(recipients.departments));
      } else if (recipients.type === 'year') {
        formData.append('years', JSON.stringify(recipients.years));
      } else if (recipients.type === 'custom') {
        formData.append('customList', JSON.stringify(recipients.customList));
      }
      
      formData.append('subject', emailContent.subject);
      formData.append('body', emailContent.body);
      
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
      
      await sendBulkEmail(formData);
      
      setSendingStatus('success');
      setError(null);
      
      // Reset form after successful send
      setTimeout(() => {
        setSendingStatus(null);
      }, 5000);
    } catch (err) {
      setSendingStatus('error');
      setError('Failed to send emails. Please try again.');
      console.error(err);
    }
  };

  const estimateRecipients = async () => {
    setEstimatedRecipientsCount(
      recipients.type === 'role' ? recipients.roles.length * 50 :
      recipients.type === 'department' ? recipients.departments.length * 30 :
      recipients.type === 'year' ? recipients.years.length * 100 :
      recipients.customList.length
    );
  };

  useEffect(() => {
    estimateRecipients();
  }, [recipients]);

  const renderRecipientSelector = () => {
    switch (recipients.type) {
      case 'role':
        return (
          <div className="recipient-options">
            <div className="option-group">
              <h4>Select Roles</h4>
              <div className="option-list">
                {userGroups.roles.map(role => (
                  <div key={role} className="option-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={recipients.roles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                      />
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'department':
        return (
          <div className="recipient-options">
            <div className="option-group">
              <h4>Select Departments</h4>
              <div className="option-list">
                {userGroups.departments.map(dept => (
                  <div key={dept} className="option-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={recipients.departments.includes(dept)}
                        onChange={() => handleDepartmentToggle(dept)}
                      />
                      {dept}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'year':
        return (
          <div className="recipient-options">
            <div className="option-group">
              <h4>Select Years</h4>
              <div className="option-list">
                {userGroups.years.map(year => (
                  <div key={year} className="option-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={recipients.years.includes(year)}
                        onChange={() => handleYearToggle(year)}
                      />
                      {year}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'custom':
        return (
          <div className="recipient-options">
            <div className="option-group">
              <h4>Enter Email Addresses</h4>
              <p className="help-text">Enter one email address per line, or separate with commas or semicolons</p>
              <textarea
                className="custom-emails"
                rows={6}
                placeholder="example1@example.com&#10;example2@example.com"
                onChange={handleCustomListChange}
              ></textarea>
              <div className="email-count">
                {recipients.customList.length} email address(es) entered
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="admin-bulk-email">
      <h2>Bulk Email System</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {sendingStatus === 'success' && (
        <div className="success-message">
          Emails have been sent successfully!
        </div>
      )}
      
      {sendingStatus === 'error' && (
        <div className="error-message">
          Failed to send emails. Please try again.
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="email-form">
          <div className="form-section">
            <h3>1. Select Recipients</h3>
            <div className="recipient-type-selector">
              <div className="selector-option">
                <label>
                  <input
                    type="radio"
                    name="recipientType"
                    value="role"
                    checked={recipients.type === 'role'}
                    onChange={() => handleRecipientTypeChange('role')}
                  />
                  By Role
                </label>
              </div>
              <div className="selector-option">
                <label>
                  <input
                    type="radio"
                    name="recipientType"
                    value="department"
                    checked={recipients.type === 'department'}
                    onChange={() => handleRecipientTypeChange('department')}
                  />
                  By Department
                </label>
              </div>
              <div className="selector-option">
                <label>
                  <input
                    type="radio"
                    name="recipientType"
                    value="year"
                    checked={recipients.type === 'year'}
                    onChange={() => handleRecipientTypeChange('year')}
                  />
                  By Year
                </label>
              </div>
              <div className="selector-option">
                <label>
                  <input
                    type="radio"
                    name="recipientType"
                    value="custom"
                    checked={recipients.type === 'custom'}
                    onChange={() => handleRecipientTypeChange('custom')}
                  />
                  Custom List
                </label>
              </div>
            </div>
            
            {renderRecipientSelector()}
            
            <div className="recipient-estimate">
              Estimated number of recipients: <strong>{estimatedRecipientsCount}</strong>
            </div>
          </div>
          
          <div className="form-section">
            <h3>2. Compose Email</h3>
            
            <div className="template-selector">
              <label>
                Use Template:
                <select 
                  value={emailContent.template} 
                  onChange={handleTemplateChange}
                >
                  <option value="">-- Select a template --</option>
                  {emailTemplates.map(template => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
              
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => setSaveTemplateMode(!saveTemplateMode)}
              >
                {saveTemplateMode ? 'Cancel Save' : 'Save as Template'}
              </button>
            </div>
            
            {saveTemplateMode && (
              <div className="save-template-form">
                <input
                  type="text"
                  placeholder="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <button 
                  type="button" 
                  className="primary-button"
                  onClick={handleSaveTemplate}
                >
                  Save Template
                </button>
              </div>
            )}
            
            <div className="email-composer">
              <div className="form-group">
                <label htmlFor="email-subject">Subject:</label>
                <input
                  id="email-subject"
                  type="text"
                  value={emailContent.subject}
                  onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                  placeholder="Enter email subject"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email-body">Email Body:</label>
                <textarea
                  id="email-body"
                  rows={10}
                  value={emailContent.body}
                  onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
                  placeholder="Enter email content"
                ></textarea>
                <p className="help-text">
                  Use markdown for formatting. You can use variables like {'{firstName}'}, {'{lastName}'}, etc.
                </p>
              </div>
              
              <div className="attachments-section">
                <h4>Attachments</h4>
                <div className="attachment-list">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                      <button 
                        type="button" 
                        className="remove-button"
                        onClick={() => handleAttachmentRemove(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  {attachments.length === 0 && (
                    <p className="no-attachments">No attachments added</p>
                  )}
                </div>
                
                <div className="attachment-controls">
                  <label className="file-input-button">
                    Add Attachment
                    <input
                      type="file"
                      multiple
                      onChange={handleAttachmentAdd}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p className="help-text">Max file size: 5 MB</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button preview-button"
              onClick={togglePreview}
            >
              {previewMode ? 'Edit Email' : 'Preview Email'}
            </button>
            
            <button 
              type="button" 
              className="primary-button send-button"
              onClick={handleSendEmail}
              disabled={sendingStatus === 'sending'}
            >
              {sendingStatus === 'sending' ? 'Sending...' : 'Send Email'}
            </button>
          </div>
          
          {previewMode && (
            <div className="email-preview">
              <h3>Email Preview</h3>
              <div className="preview-subject">
                <strong>Subject:</strong> {emailContent.subject}
              </div>
              <div className="preview-body">
                <div dangerouslySetInnerHTML={{ __html: emailContent.body }}></div>
              </div>
              {attachments.length > 0 && (
                <div className="preview-attachments">
                  <strong>Attachments:</strong>
                  <ul>
                    {attachments.map((file, index) => (
                      <li key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBulkEmail;