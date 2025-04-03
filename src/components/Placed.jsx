import React, { useState } from "react";
import "./Placed.css";

const placedStudents = [
  {
    id: 1,
    image: "https://t3.ftcdn.net/jpg/00/77/71/12/360_F_77711294_BA5QTjtgGPmLKCXGdtbAgZciL4kEwCnx.jpg",
    name: "Raj Sharma (B.tech)",
    designation: "Software Engineer",
    organization: "Google",
  },
  {
    id: 2,
    image: "https://img.freepik.com/free-photo/anime-style-portrait-young-student-attending-school_23-2151125048.jpg",
    name: "Khushnam Chauhan (MCA)",
    designation: "Software Engineer SWE",
    organization: "Google",
  },
  {
    id: 3,
    image: "https://img.freepik.com/free-photo/young-student-woman-wearing-denim-jacket-eyeglasses-holding-colorful-folders-showing-thumb-up-pink_176532-13861.jpg",
    name: "Apoorva Sharma (MCA)",
    designation: "Data Scientist",
    organization: "Amazon",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/150",
    name: "Sophia Johnson",
    designation: "Backend Developer",
    organization: "Microsoft",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/150",
    name: "Chris Brown",
    designation: "AI Engineer",
    organization: "Tesla",
  },
  {
    id: 6,
    image: "https://via.placeholder.com/150",
    name: "Emma Wilson",
    designation: "Product Designer",
    organization: "Apple",
  },
  {
    id: 7,
    image: "https://via.placeholder.com/150",
    name: "David Miller",
    designation: "Cybersecurity Expert",
    organization: "IBM",
  },
  {
    id: 8,
    image: "https://via.placeholder.com/150",
    name: "Emily Davis",
    designation: "Full Stack Developer",
    organization: "Adobe",
  },
  {
    id: 9,
    image: "https://via.placeholder.com/150",
    name: "William Scott",
    designation: "DevOps Engineer",
    organization: "Oracle",
  },
];

function Placed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const studentsPerPage = 3; // Show 3 students at a time on larger screens
  const totalSlides = Math.ceil(placedStudents.length / studentsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="placedStudents">
      <div className="placed-head">Placed Students</div>
      <div className="slider-container">
        <button className="prev-btn" onClick={prevSlide}>&#10094;</button>
        <div className="placed-list">
          {placedStudents
            .slice(currentIndex * studentsPerPage, currentIndex * studentsPerPage + studentsPerPage)
            .map((student) => (
              <div className="placed-card" key={student.id}>
                <div className="placed-pic">
                  <img src={student.image} alt="studentPic" />
                </div>
                <div className="student-details">
                  <h3 className="student-name">{student.name}</h3>
                  <h4 className="student-designation">{student.designation}</h4>
                  <h4 className="student-organization">{student.organization}</h4>
                </div>
              </div>
            ))}
        </div>
        <button className="next-btn" onClick={nextSlide}>&#10095;</button>
      </div>
    </div>
  );
}

export default Placed;
