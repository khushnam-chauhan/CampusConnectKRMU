import React from "react";
import { Book } from "lucide-react";
import { Link } from "react-router-dom";

function TrainingCard({ title, date }) {
  return (
    <div>
      <Link to="/cdc-trainings" className="training-item1">
        <div className="book-icon">
          <Book size={32} />
        </div>
        <div className="training-details">
          <h4 className="training-name">{title}</h4>
          <p className="training-date">{date ? new Date(date).toLocaleString() : "TBA"}</p>
        </div>
      </Link>
    </div>
  );
}

export default TrainingCard;