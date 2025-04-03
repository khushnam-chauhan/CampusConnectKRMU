import React, { useState } from "react";
import "./auth.css";
import Login from "./Login";
import Signup from "./Register";
import Navbar from "../../layouts/Navbar";

const AuthContainer = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <>
      <Navbar/>
      <div className="auth-container">
    
    <div className={`container ${isSignUp ? "right-panel-active" : ""}`} id="container">
      <div className="form-container sign-up-container">
        <Signup />
      </div>
      <div className="form-container sign-in-container">
        <Login />
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hi!</h1>
            <p>Don't have an account yet? then start by clicking below</p>
            <button className="ghost" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default AuthContainer;
