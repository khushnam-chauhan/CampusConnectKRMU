import axios from "axios"

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/email`

// Set auth token for API requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }
}

// Get system email configuration
export const getSystemEmailConfig = async () => {
  try {
    const token = localStorage.getItem("token")
    setAuthToken(token)

    const response = await axios.get(`${API_URL}/system-config`)
    return response.data
  } catch (error) {
    console.error("Error fetching system email config:", error)
    throw error.response?.data || { message: "Failed to fetch system email configuration" }
  }
}

// Fetch user groups for email targeting
export const fetchUserGroups = async () => {
  try {
    const token = localStorage.getItem("token")
    setAuthToken(token)

    // Add proper error handling for non-JSON responses
    const response = await axios.get(`${API_URL}/user-groups`, {
      validateStatus: (status) => status >= 200 && status < 300,
      transformResponse: [
        (data) => {
          try {
            // Try to parse as JSON
            return JSON.parse(data)
          } catch (e) {
            // If parsing fails, it's not valid JSON
            console.error("Received non-JSON response:", data.substring(0, 100) + "...")
            throw new Error("Received non-JSON response from server")
          }
        },
      ],
    })

    return response.data
  } catch (error) {
    console.error("Error fetching user groups:", error)
    // Provide more detailed error information
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response headers:", error.response.headers)
      // Log a preview of the response data if it's not JSON
      if (typeof error.response.data === "string") {
        console.error("Response data preview:", error.response.data.substring(0, 200))
      }
    }
    throw error.response?.data || { message: "Failed to fetch user groups. Check API endpoint and server logs." }
  }
}

// Fetch email templates
export const fetchEmailTemplates = async () => {
  try {
    const token = localStorage.getItem("token")
    setAuthToken(token)

    const response = await axios.get(`${API_URL}/templates`)
    return response.data
  } catch (error) {
    console.error("Error fetching email templates:", error)
    throw error.response?.data || { message: "Failed to fetch email templates" }
  }
}

// Save email template
export const saveTemplate = async (templateData) => {
  try {
    const token = localStorage.getItem("token")
    setAuthToken(token)

    const response = await axios.post(`${API_URL}/templates`, templateData)
    return response.data
  } catch (error) {
    console.error("Error saving template:", error)
    throw error.response?.data || { message: "Failed to save template" }
  }
}

// Send bulk email
export const sendBulkEmail = async (formData) => {
  try {
    const token = localStorage.getItem("token")
    setAuthToken(token)

    const response = await axios.post(`${API_URL}/send`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error sending bulk email:", error)
    throw error.response?.data || { message: "Failed to send email" }
  }
}

// Get email analytics
export const getEmailAnalytics = async (campaignId) => {
  try {
    const token = localStorage.getItem("token")
    setAuthToken(token)

    const response = await axios.get(`${API_URL}/analytics/${campaignId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching email analytics:", error)
    throw error.response?.data || { message: "Failed to fetch email analytics" }
  }
}