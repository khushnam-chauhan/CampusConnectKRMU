import { useState } from 'react';
import './CVPage.css';

export default function CVInsightsPage() {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Fake API to simulate GenAI resume review
  const fakeResumeReviewAPI = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          scores: {
            overall: 82,
            contactInfo: 90,
            education: 85,
            workExperience: 70,
            skills: 95,
            projects: 80,
            certifications: 75,
          },
          strengths: [
            'Strong skills section with relevant technical skills.',
            'Complete contact information provided.',
          ],
          weaknesses: [
            'Work experience lacks quantifiable achievements.',
            'Certifications section could be expanded.',
          ],
          tips: [
            'Add quantifiable achievements to work experience (e.g., "Increased sales by 20%").',
            'Include at least one recent certification to boost credibility.',
            'Incorporate keywords from job descriptions for ATS compatibility.',
            'Ensure consistent formatting with bullet points and clear headings.',
            'Add 1-2 projects to demonstrate practical experience.',
          ],
        });
      }, 1500);
    });
  };

  // Handle file upload and fake API call
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      // Call fake API
      const review = await fakeResumeReviewAPI(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setReviewData(review);
      setMessage('Resume analyzed successfully!');
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Render resume summary
  const renderResumeSummary = () => {
    if (!reviewData) return null;

    const { scores, strengths, weaknesses } = reviewData;

    return (
      <div className="cv-insights-resume-summary">
        <h3>Resume Summary</h3>
        <div className="cv-insights-summary-content">
          <div className="cv-insights-overall-score">
            <h4>Overall Completeness</h4>
            <div className="cv-insights-score-circle">
              <svg viewBox="0 0 36 36">
                <path
                  className="cv-insights-score-circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="cv-insights-score-circle-fill"
                  strokeDasharray={`${scores.overall}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="cv-insights-score-text">
                  {scores.overall}%
                </text>
              </svg>
            </div>
          </div>
          <div className="cv-insights-strengths-weaknesses">
            <h4>Strengths</h4>
            <ul>
              {strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
            <h4>Areas for Improvement</h4>
            <ul>
              {weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Render section analysis with progress bars
  const renderSectionAnalysis = () => {
    if (!reviewData) return null;

    const { scores } = reviewData;
    const sections = [
      { name: 'Contact Info', score: scores.contactInfo },
      { name: 'Education', score: scores.education },
      { name: 'Work Experience', score: scores.workExperience },
      { name: 'Skills', score: scores.skills },
      { name: 'Projects', score: scores.projects },
      { name: 'Certifications', score: scores.certifications },
    ];

    return (
      <div className="cv-insights-section-analysis">
        <h3>Resume Section Analysis</h3>
        <div className="cv-insights-section-grid">
          {sections.map((section) => (
            <div key={section.name} className="cv-insights-section-item">
              <span>{section.name}</span>
              <div className="cv-insights-progress-bar">
                <div
                  className="cv-insights-progress-bar-fill"
                  style={{ width: `${section.score}%` }}
                ></div>
              </div>
              <span>{section.score}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render improvement tips
  const renderImprovementTips = () => {
    if (!reviewData) return null;

    const { tips } = reviewData;

    return (
      <div className="cv-insights-improvement-tips">
        <h3>Resume Improvement Tips</h3>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="cv-insights-page-container">
      <h2 className="cv-insights-page-title">CV Insights & Review</h2>

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

      {loading ? (
        <div className="cv-insights-loading-container">
          <div className="cv-insights-loading-spinner"></div>
        </div>
      ) : !reviewData ? (
        <div className="cv-insights-no-resume">
          <h3>Upload Your Resume</h3>
          <p>Upload your resume to receive personalized insights and improvement suggestions.</p>
          <label className="cv-insights-file-upload-button">
            Upload Resume
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
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
      ) : (
        <>
          {renderResumeSummary()}
          {renderSectionAnalysis()}
          {renderImprovementTips()}
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
        </>
      )}
    </div>
  );
}
