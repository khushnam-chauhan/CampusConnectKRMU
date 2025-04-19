import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../redux/authSlice";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid verification link");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email`,
          { token },
          { headers: { "Content-Type": "application/json" } }
        );

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
        console.error("Verification Error:", error.response || error.message);
        setError(error.response?.data?.message || "Verification failed. Try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h1 className="verify-email-title">Email Verification</h1>
        {loading ? (
          <div className="verify-email-message loading">Verifying your email...</div>
        ) : error ? (
          <div className="verify-email-message error">{error}</div>
        ) : (
          <div className="verify-email-message success">Email verified! Redirecting...</div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
