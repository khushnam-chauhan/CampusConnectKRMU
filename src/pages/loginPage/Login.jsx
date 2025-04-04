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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Login request
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res && res.data) {
        // Store token
        const token = res.data.token;
        localStorage.setItem("token", token);
        
        // Set default axios header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Fetch user profile after login
        const profileRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes && profileRes.data) {
          const user = profileRes.data;
          
          
          // Store user role in localStorage
          localStorage.setItem("role", user.role);
          
          // Update Redux state by dispatching fetchUser action
          dispatch(fetchUser());
          
          // Redirect based on role
          if (user.role === "admin" || user.role === "staff") {
            console.log("Redirecting to admin panel");
            navigate("/admin-panel");
          } else if (user.role === "student") {
            // Always redirect students to student-details page
            navigate("/student-details");
          } else {
            navigate("/dashboard"); // Fallback redirect
          }
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response || error.message);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="social-container">
        <a href="#" className="social"><i className="fab fa-google"></i></a>
        <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="social"><i className="fab fa-github"></i></a>
      </div>
      <span>or use your account</span>
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <a href="#">Forgot your password?</a>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default Login;