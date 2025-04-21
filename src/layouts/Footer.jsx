import React from "react";
import "./Footer.css";
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-section">
          <h2>Contact Us</h2>
          <p><FaMapMarkerAlt />KRMU, Sohna Rd, Gurugram, India</p>
          <p><FaPhone /> +91 98765 43210</p>
          <p><FaEnvelope /> info@company.com</p>
        </div>

        <div className="footer-section">
          <h2>Quick Links</h2>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/jobs">Jobs</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com/krmuniv/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://x.com/krmuniversity?lang=en" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://www.linkedin.com/school/krmuniv/posts/?feedView=all" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://www.instagram.com/krmuniv/?hl=en" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 CampusConnect. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
