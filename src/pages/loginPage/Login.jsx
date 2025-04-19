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

      setResendEmailSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setResendEmailLoading(false);
    }
  };

  return (
    <div className="form-content">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <button
        className="ghost"
        onClick={handleResendVerificationEmail}
        disabled={resendEmailLoading}
      >
        {resendEmailLoading ? "Sending..." : "Resend Verification Email"}
      </button>
      {resendEmailSuccess && <div className="success-message">{resendEmailSuccess}</div>}
    </div>
  );
};

export default Login;
