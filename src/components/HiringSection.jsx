import React from 'react'
import './HiringSection.css'
import company from '../assets/company.png' 
function HiringSection() {
  return (
    <div className='hiring-section'>
        <div>
            <h1  className='hiring-heading'>Top Hiring Companies</h1>
        </div>
        <div>
            <img className='hiring' src={company} alt="Hiring companies " />
        </div>
    </div>
  )
}

export default HiringSection