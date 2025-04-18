import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", rollNo: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const allowedDomains = ["krmu.edu.in", "gmail.com"];

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    const domain = email.split("@")[1];
    if (!allowedDomains.includes(domain)) {
      return `Email must belong to ${allowedDomains.join(" or ")}.`;
    }

    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res && res.data) {
        setSuccess(res.data.message);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response || error.message);
      setError(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        {success ? (
          <div className="signup-success">{success}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="rollNo"
                placeholder="Roll No"
                value={formData.rollNo}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            {error && (
              <div className="signup-error">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`signup-button ${loading ? 'disabled' : ''}`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;