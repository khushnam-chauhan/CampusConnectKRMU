import React from 'react'
import { Book, Menu } from "lucide-react"
import { Link } from 'react-router-dom'
function TrainingCard() {
  return (
    <div>
         <Link to="/trainings" className="training-item">
          <div className="book-icon">
            <Book size={32} />
          </div>
          <div className="training-details">
            <h4 className="training-name">Interview Skills Seminar</h4>
            <p className="training-date">May 20, 2025 - 3:30 PM</p>
          </div>
        </Link>

    </div>
  )
}

export default TrainingCard