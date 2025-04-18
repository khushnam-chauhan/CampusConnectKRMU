import React, { useState, useEffect } from "react";
import "./CDCTrainings.css";

const CDCTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trainings from the backend
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trainings`);
        if (!response.ok) {
          throw new Error("Failed to fetch trainings");
        }
        const data = await response.json();
        // Sort by date
        const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setTrainings(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div className="cdc-trainings">
      <p className="intro-text">
        The Career Development Cell (CDC) offers a variety of training programs to enhance your skills and prepare you for the professional world. Check out the upcoming sessions below!
      </p>

      <div className="trainings-list">
        {loading ? (
          <div className="loading">Loading trainings...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : trainings.length === 0 ? (
          <div className="no-trainings">No training programs scheduled at the moment.</div>
        ) : (
          trainings.map((training) => (
            <div key={training._id} className="training-card">
              <h3>{training.title}</h3>
              <p className="description">{training.description}</p>
              <div className="details">
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {new Date(training.date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p><strong>Duration:</strong> {training.duration}</p>
                <p><strong>Mode:</strong> {training.mode}</p>
              </div>
              <a
                href={training.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="register-button"
              >
                Register Now
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CDCTrainings;