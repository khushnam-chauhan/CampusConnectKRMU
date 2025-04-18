import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendEmailLoading, setResendEmailLoading] = useState(false);
  const [resendEmailSuccess, setResendEmailSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res && res.data) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        dispatch(fetchUser());
        if (user.role === "admin" || user.role === "staff") {
          navigate("/admin-panel");
        } else if (user.role === "student") {
          navigate("/student-details");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response || error.message);
      console.error("Error details:", error.response?.data); 
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!formData.email) {
      setError("Please enter your email address first.");
      return;
    }

    setResendEmailLoading(true);
    setResendEmailSuccess(null);
    setError(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/resend-verification`, 
        { email: formData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res && res.data) {
        setResendEmailSuccess(res.data.message);
      }
    } catch (error) {
      console.error("Resend Verification Error:", error.response || error.message);
      setError(error.response?.data?.message || "Failed to resend verification email. Please try again.");
    } finally {
      setResendEmailLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Sign In</h1>
        <form onSubmit={handleSubmit}>
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
            <div className="login-error">{error}</div>
          )}
          {resendEmailSuccess && (
            <div className="login-success">{resendEmailSuccess}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? 'disabled' : ''}`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {error && error.includes("verify your email") && (
            <button 
              type="button" 
              onClick={handleResendVerificationEmail}
              disabled={resendEmailLoading}
              className="resend-button"
            >
              {resendEmailLoading ? "Sending..." : "Resend Verification Email"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;