import React from 'react'
import FeatureCard from './FeatureCard'
import "./Features.css"
import bgImage from '../assets/KRmu.webp'

function Features() {
  return (
    <div className='features' style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay"></div>

      <div className="content"> 
        <div className='feature-heading'>
          <h2 className='f-heading'>✨ Why CampusConnect?</h2>
          <p className='f-para'>An all-in-one career platform that puts YOU in control.</p>
        </div>

        <div className="cards">
          <FeatureCard head="🔍 Exclusive Job Listings" para="Curated job opportunities tailored for students and fresh graduates." />
          <FeatureCard head="🤖 AI-Powered Resume Review" para="Smart insights to enhance your CV and improve hiring chances." />
          <FeatureCard head="📄 One-Click Applications" para="Apply directly for internships and gain real-world experience." />
          <FeatureCard head="💡 Real Interview Insights" para="Learn from interview experiences shared by past candidates." />
          <FeatureCard head="🎓 CDC Training & Events" para="Participate in workshops, training sessions, and career fairs." />
          <FeatureCard head="📊 Internship & Placement Tracking" para="Stay updated with job offers, interview rounds, and final placements." />
        </div>
      </div>
    </div>
  )
}

export default Features
