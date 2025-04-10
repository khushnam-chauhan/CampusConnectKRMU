import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", rollNo: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (res && res.data) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role); // Still store the role
        
        alert("Signup successful!");
        
        // Since all signups are students, redirect directly to student-details
        window.location.href = "/student-details";
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Signup Error:", error.response || error.message);
      alert(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
      <input type="text" name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;