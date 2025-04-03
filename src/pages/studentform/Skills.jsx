import React from 'react';
import { FaTrash } from "react-icons/fa";

const SkillsSection = ({ skills, handleSkillChange, addSkill, removeSkill }) => {
  return (
    <div className="form-group">
      <label>Skills</label>
      <div className="skills-container1">
        {skills.length === 0 && (
          <p className="no-items-message">Add at least one skill</p>
        )}
        
        {skills.map((skill, index) => (
          <div key={index} className="skill-item1">
            <input
              type="text"
              placeholder="Enter skill"
              value={skill.name || ""}
              onChange={(e) => handleSkillChange(index, e.target.value)}
              required
            />

            <button
              type="button"
              className="remove-button"
              onClick={() => removeSkill(index)}
              aria-label="Remove skill"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button 
          type="button" 
          className="add-button" 
          onClick={addSkill}
        >
          Add Skill
        </button>
      </div>
    </div>
  );
};

export default SkillsSection;