import React, { useState } from "react";
import "./FAQ.css";

const faqsData = [
  {
    question: "How can I apply for jobs?",
    answer: "Create a profile, upload your resume, and start applying to listed jobs.",
  },
  {
    question: "What are the eligibility criteria?",
    answer: "The eligibility criteria depend on the job listing. Please check each job post for details.",
  },
  {
    question: "How do I track my job application status?",
    answer: "You can track your application status from the 'My Applications' section in your profile.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq">
      <div className="faq-head">FAQs</div>
      <div className="faq-qs">
        {faqsData.map((faq, index) => (
          <div className="fqs" key={index}>
            <div className="qs-container" onClick={() => handleToggle(index)}>
              <p className="qs-head">{faq.question}</p>
              <p className="f-toggle">{activeIndex === index ? "-" : "+"}</p>
            </div>
            {activeIndex === index && <p className="qs-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
