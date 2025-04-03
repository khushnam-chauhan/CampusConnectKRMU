import React from "react";
import './Hero.css'
import img1 from "../assets/hero-img.png"
import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate= useNavigate();
  function handleJoin(){
    navigate('/authContainer');
  }
  function handlePost(){
    navigate('/post-job');
  }
  return (
    <div className="hero-section">
      <div className="hero-left">
        <div className="hero-left-up">
          <h2 className="hero-heading">
          CampusConnect - Bridging Talent & Opportunities
          </h2>
          <p className="hero-para">A smart, efficient platform connecting students with career opportunities, internships, and industry insights.</p>
        </div>
        <div className="hero-buttons">
            <button onClick={handleJoin} className="join-now">
                Join Now
            </button>
            <button className="post-job" onClick={handlePost}>
                Post a Job
            </button>
        </div>
      </div>
      <div className="hero-right">
        <img  className="hero-image" src={img1} alt="Hero Image"/>
      </div>

    </div>
  );
}

export default Hero;
