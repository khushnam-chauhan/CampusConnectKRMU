import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTrainings.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const AdminTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    duration: "",
    mode: "",
    registrationLink: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all trainings
  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/trainings`);
      setTrainings(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch trainings");
    } finally {
      setLoading(false);
    }
  };

  // Create or update a training
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update training
        await axios.put(`${API_BASE_URL}/trainings/${editingId}`, formData, getAuthConfig());
      } else {
        // Create new training
        await axios.post(`${API_BASE_URL}/trainings`, formData, getAuthConfig());
      }
      fetchTrainings(); // Refresh the list
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save training");
    }
  };

  // Delete a training
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      try {
        await axios.delete(`${API_BASE_URL}/trainings/${id}`, getAuthConfig());
        fetchTrainings(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete training");
      }
    }
  };

  // Edit a training
  const handleEdit = (training) => {
    setFormData({
      title: training.title,
      description: training.description,
      date: new Date(training.date).toISOString().slice(0, 16),
      duration: training.duration,
      mode: training.mode,
      registrationLink: training.registrationLink,
    });
    setEditingId(training._id);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      duration: "",
      mode: "",
      registrationLink: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <div className="admin-trainings">
      <h2>Training Management</h2>
      <button className="add-training-button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Training"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="training-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Mode</label>
            <input
              type="text"
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Registration Link</label>
            <input
              type="url"
              value={formData.registrationLink}
              onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {editingId ? "Update Training" : "Create Training"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading trainings...</div>
      ) : trainings.length === 0 ? (
        <div className="no-trainings">No trainings available.</div>
      ) : (
        <div className="trainings-list">
          {trainings.map((training) => (
            <div key={training._id} className="training-item">
              <div className="training-details">
                <h3>{training.title}</h3>
                <p>{training.description}</p>
                <p><strong>Date:</strong> {new Date(training.date).toLocaleString()}</p>
                <p><strong>Duration:</strong> {training.duration}</p>
                <p><strong>Mode:</strong> {training.mode}</p>
                <p><strong>Registration Link:</strong> <a href={training.registrationLink} target="_blank" rel="noopener noreferrer">{training.registrationLink}</a></p>
              </div>
              <div className="training-actions">
                <button className="edit-button" onClick={() => handleEdit(training)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(training._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTrainings;