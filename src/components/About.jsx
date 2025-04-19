import React from "react";
import "./About.css"; // Optional if using plain CSS
import Navbar from "../layouts/Navbar";

function About() {
  return (<>
    <Navbar/>
    <div className="about-container">
      <div className="about-header">
        <h1>About CampusConnect</h1>
      </div>
      <div className="about-content">
        <p>
          <strong>CampusConnect</strong> is a centralized platform designed to streamline
          opportunities and communication in a college environment. It serves as a bridge
          between students, placement cells, and recruiters — offering features like job
          postings, profile management, resume uploads, resume analysis, application tracking, CDC trainings.
        </p>
        <p>
          The platform aims to empower students, by providing
          visibility, ease of access to internships and jobs, and smart tools like resume analysis.
        </p>

        <hr />

        <div className="about-dev">
          <h2>Who Developed It?</h2>
          <p>
            <strong>Khushnam Chauhan (MCA batch 2023)</strong> is the full-stack developer behind CampusConnect. With
            expertise in the MERN stack, Khushnam developed the entire platform interface, backend
            services, and dynamic features to create a seamless experience for students and admins alike.
          </p>
        </div>

        <div className="about-dev">
          <h2>AI & Resume Insights by Apoorva Sharma</h2>
          <p>
            <strong>Apoorva Sharma (MCA batch 2023)</strong> is an AI/ML enthusiast and skilled data analyst who developed
            and integrated the intelligent <em>Resume Insights</em> feature. This model helps analyze
            uploaded resumes and provides feedback to students to improve their chances during placements.
            Her contribution added a smart and scalable dimension to CampusConnect, making it more than just
            a job board.
          </p>
        </div>
      </div>
    </div>

  </>
  );
}

export default About;
