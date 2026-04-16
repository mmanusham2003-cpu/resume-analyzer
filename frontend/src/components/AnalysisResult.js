import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './AnalysisResult.css';

const getScoreColor = (score) => {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#3b82f6';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
};

const SectionCard = ({ title, score, feedback, icon }) => {
  const color = getScoreColor(score);

  return (
    <div className="section-card">
      <div className="section-card-header">
        <div className="section-icon">{icon}</div>
        <div className="section-info">
          <h4 className="section-title">{title}</h4>
          <div className="section-score-bar-wrap">
            <div className="section-score-bar">
              <div
                className="section-score-fill"
                style={{ width: `${score}%`, background: color }}
              />
            </div>
            <span className="section-score-value" style={{ color }}>{score}/100</span>
          </div>
        </div>
      </div>
      {feedback && <p className="section-feedback">{feedback}</p>}
    </div>
  );
};

const AnalysisResult = ({ analysis, matchScore, fileName }) => {
  if (!analysis || !analysis.sections) {
    return null;
  }

  const { overallScore, sections, keywords, suggestions, summary } = analysis;
  const color = getScoreColor(overallScore);

  const sectionIcons = {
    contactInfo: '📋',
    experience: '💼',
    education: '🎓',
    skills: '⚡',
    formatting: '📐',
  };

  const sectionLabels = {
    contactInfo: 'Contact Information',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    formatting: 'Formatting & Layout',
  };

  return (
    <div className="analysis-result" id="analysis-result">
      {/* Header with overall score */}
      <div className="result-header glass-card">
        <div className="result-score-circle">
          <CircularProgressbar
            value={overallScore}
            text={`${overallScore}`}
            styles={buildStyles({
              textSize: '28px',
              textColor: color,
              pathColor: color,
              trailColor: 'rgba(255,255,255,0.08)',
              pathTransitionDuration: 1.5,
            })}
          />
          <span className="score-label" style={{ color }}>{getScoreLabel(overallScore)}</span>
        </div>

        <div className="result-meta">
          <h2 className="result-title">Resume Analysis</h2>
          {fileName && <p className="result-filename">{fileName}</p>}
          {summary && <p className="result-summary">{summary}</p>}
          {matchScore > 0 && (
            <div className="match-score-badge">
              <span className="match-label">Job Match</span>
              <span className="match-value" style={{ color: getScoreColor(matchScore) }}>
                {matchScore}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section breakdowns */}
      <div className="sections-grid">
        {Object.entries(sections).map(([key, data]) => (
          data && (
            <SectionCard
              key={key}
              title={sectionLabels[key] || key}
              score={data.score || 0}
              feedback={data.feedback}
              icon={sectionIcons[key] || '📄'}
            />
          )
        ))}
      </div>

      {/* Keywords */}
      {keywords && keywords.length > 0 && (
        <div className="result-section glass-card">
          <h3 className="result-section-title">
            <span className="section-icon-inline">🔑</span>
            Keywords Found
          </h3>
          <div className="keywords-list">
            {keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">{keyword}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="result-section glass-card">
          <h3 className="result-section-title">
            <span className="section-icon-inline">💡</span>
            Improvement Suggestions
          </h3>
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="suggestion-item">
                <span className="suggestion-number">{index + 1}</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
