import { useState } from 'react';
import './CVPage.css';

export default function CVInsightsPage() {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [industry, setIndustry] = useState('software');
  const [jobDescription, setJobDescription] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('industry', industry);
    if (jobDescription.trim()) {
      formData.append('job_description', jobDescription);
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      setMessage('');
      setReviewData(null);
      setLoading(true);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('https://resume-insights.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();
      if (result.success) {
        setReviewData(result);
        setMessage('Resume analyzed successfully!');
      } else {
        setError(result.error || 'Unknown error occurred.');
      }
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const getScoreRating = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const renderScoreCircle = () => {
    if (!reviewData) return null;
    
    const score = Math.round(reviewData.ats_score);
    const scorePercentage = `${score}%`;
    const gradientStyle = {
      background: `conic-gradient(#4CAF50 0% ${scorePercentage}, #f1f1f1 ${scorePercentage} 100%)`
    };
    
    return (
      <div className="score-container">
        <div className="score-circle" style={gradientStyle}>
          <div className="score-inner-circle">
            <div className="score-value">{scorePercentage}</div>
          </div>
        </div>
        <p>Your resume's ATS compatibility score</p>
      </div>
    );
  };
  
  const renderFactorScores = () => {
    if (!reviewData || !reviewData.factorScores) return null;
    
    const factorNames = {
      'keyword_match': 'Keyword Matching',
      'format_score': 'Format Score',
      'word_count': 'Word Count',
      'action_verbs': 'Action Verbs',
      'file_format': 'File Format',
      'contact_info': 'Contact Information',
      'education_format': 'Education Format'
    };
    
    return (
      <div className="factor-scores-container">
        <h3>Factor Scores</h3>
        <div className="factor-scores">
          {Object.entries(reviewData.factorScores).map(([factor, score]) => {
            const scorePercent = Math.round(score * 100);
            const displayName = factorNames[factor] || factor.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            return (
              <div className="factor-score" key={factor}>
                <h4>{displayName}</h4>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${scorePercent}%` }}></div>
                </div>
                <p>{scorePercent}% - {getScoreRating(scorePercent)}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderRecommendations = () => {
    if (!reviewData || !reviewData.recommendations) return null;
    
    return (
      <div className="recommendations-container">
        <h3>Prioritized Recommendations</h3>
        <ul className="recommendations-list">
          {reviewData.recommendations.map((rec, index) => (
            <li 
              key={index} 
              className={`priority-${rec.priority ? rec.priority.toLowerCase() : 'medium'}`}
            >
              {rec.category && (
                <span className="category-tag">{rec.category}</span>
              )}
              {rec.recommendation}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderKeywords = () => {
    if (!reviewData || !reviewData.keywordAnalysis) return null;
    
    const keywords = [];
    const industryKeywords = reviewData.keywordAnalysis.industryKeywords || {};
    
    for (const industry in industryKeywords) {
      if (Array.isArray(industryKeywords[industry])) {
        keywords.push(...industryKeywords[industry]);
      }
    }
    
    return (
      <div className="keywords-container">
        <h3>Industry-Specific Keywords Found</h3>
        <div className="keywords-list">
          {keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <span className="keyword" key={index}>{keyword}</span>
            ))
          ) : (
            <p className="empty-message">No industry-specific keywords found.</p>
          )}
        </div>
      </div>
    );
  };
  
  const renderFormattingIssues = () => {
    if (!reviewData || !reviewData.metrics || !reviewData.metrics.formattingIssues) return null;
    
    const formattingIssues = reviewData.metrics.formattingIssues;
    
    return (
      <div className="format-issues-container">
        <h3>Formatting Issues Detected</h3>
        <ul className="format-issues-list">
          {formattingIssues.length > 0 ? (
            formattingIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))
          ) : (
            <li>No formatting issues detected.</li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="cv-insights-page-container">

      {message && (
        <div className="cv-insights-message-banner">
          {message}
          <button className="cv-insights-close-button" onClick={() => setMessage('')}>×</button>
        </div>
      )}

      {error && (
        <div className="cv-insights-error-banner">
          {error}
          <button className="cv-insights-close-button" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {!reviewData && (
        <div className="cv-insights-upload-form">
          <h3>Upload Your Resume</h3>
          <p>Optimize your resume to pass through Applicant Tracking Systems and get seen by recruiters.</p>

          <div className="input-group">
            <label htmlFor="resume">Upload Resume (PDF format recommended)</label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-description">Job Description (Optional)</label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to improve keyword matching analysis"
              className="cv-insights-textarea"
            />
          </div>

          <div className="input-group">
            <label htmlFor="industry">Target Industry</label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="cv-insights-industry-dropdown"
            >
              <option value="software">Software</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="engineering">Engineering</option>
              <option value="data_science">Data Science</option>
            </select>
          </div>

          <button 
            className="cv-insights-submit-button" 
            onClick={() => document.getElementById('resume').click()}
            disabled={isUploading}
          >
            Check ATS Score
          </button>

          {isUploading && (
            <div className="cv-insights-upload-progress">
              <div className="cv-insights-progress-bar">
                <div
                  className="cv-insights-progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span>{uploadProgress}%</span>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing your resume... Please wait.</p>
        </div>
      )}

      {reviewData && (
        <div className="results-container">
          <h2>Your ATS Score Results</h2>
          
          {/* Score Circle */}
          {renderScoreCircle()}
          
          {/* Factor Scores */}
          {renderFactorScores()}
          
          {/* Recommendations */}
          {renderRecommendations()}
          
          {/* Keywords */}
          {renderKeywords()}
          
          {/* Formatting Issues */}
          {renderFormattingIssues()}
          
          <div className="cv-insights-upload-resume">
            <h3>Upload New Resume</h3>
            <label className="cv-insights-file-upload-button">
              Replace Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}