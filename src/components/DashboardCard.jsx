import { Link } from "react-router-dom";
import { useState } from "react";

const DashboardCard = ({ to, title, number, subtitle, bgColor, hoverBgColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className="dashboard-card"
      style={{ backgroundColor: isHovered ? hoverBgColor : bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="card-title">{title}</h3>
      <div className="card-content">
        <span className="card-number">{number}</span>
        <span className="card-subtitle">{subtitle}</span>
      </div>
    </Link>
  );
};

export default DashboardCard