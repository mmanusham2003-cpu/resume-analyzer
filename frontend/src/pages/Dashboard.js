import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getResumes, deleteResume } from '../services/resumeService';
import './Dashboard.css';

const getScoreColor = (score) => {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#3b82f6';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getStatusBadge = (status) => {
  const styles = {
    uploaded: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', label: 'Uploaded' },
    parsing: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Parsing' },
    parsed: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', label: 'Parsed' },
    analyzing: { bg: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', label: 'Analyzing' },
    completed: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', label: 'Completed' },
    failed: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', label: 'Failed' },
  };
  return styles[status] || styles.uploaded;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await deleteResume(id);
      setResumes(resumes.filter((r) => r._id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome back, <span className="hero-name">{user?.name}</span>
            </h1>
            <p className="hero-subtitle">
              Upload and analyze your resumes with AI-powered insights
            </p>
          </div>
          <Link to="/analyzer" className="btn btn-primary hero-cta" id="new-analysis-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Analysis
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card glass-card">
            <span className="stat-value">{resumes.length}</span>
            <span className="stat-label">Total Resumes</span>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-value">
              {resumes.filter((r) => r.status === 'completed').length}
            </span>
            <span className="stat-label">Analyzed</span>
          </div>
          <div className="stat-card glass-card">
            <span className="stat-value" style={{ color: getScoreColor(
              resumes.filter(r => r.status === 'completed' && r.analysis?.overallScore)
                .reduce((acc, r, _, arr) => acc + r.analysis.overallScore / arr.length, 0)
            ) }}>
              {resumes.filter(r => r.status === 'completed' && r.analysis?.overallScore).length > 0
                ? Math.round(
                    resumes.filter(r => r.status === 'completed' && r.analysis?.overallScore)
                      .reduce((acc, r, _, arr) => acc + r.analysis.overallScore / arr.length, 0)
                  )
                : '—'}
            </span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>

        {/* Resumes List */}
        <div className="resumes-section">
          <h2 className="section-heading">Your Resumes</h2>

          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="empty-state glass-card">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="12" y="8" width="40" height="48" rx="8" fill="rgba(99, 102, 241, 0.1)" stroke="var(--color-accent-primary)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M24 24h16M24 32h12M24 40h8" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="empty-title">No resumes yet</h3>
              <p className="empty-text">Upload your first resume to get AI-powered feedback</p>
              <Link to="/analyzer" className="btn btn-primary" id="empty-upload-btn">
                Upload Resume
              </Link>
            </div>
          ) : (
            <div className="resume-grid">
              {resumes.map((resume) => {
                const badge = getStatusBadge(resume.status);
                return (
                  <div key={resume._id} className="resume-card glass-card" id={`resume-${resume._id}`}>
                    <div className="resume-card-top">
                      <div className="resume-file-icon">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <rect x="4" y="2" width="24" height="28" rx="4" fill="rgba(99, 102, 241, 0.15)" stroke="var(--color-accent-primary)" strokeWidth="1" />
                          <path d="M10 10h12M10 15h8M10 20h10" stroke="var(--color-text-muted)" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="resume-card-info">
                        <h4 className="resume-card-name">{resume.fileName}</h4>
                        <span className="resume-card-date">
                          {new Date(resume.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span
                        className="status-badge"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {resume.status === 'completed' && resume.analysis?.overallScore && (
                      <div className="resume-card-score">
                        <div className="mini-score-bar">
                          <div
                            className="mini-score-fill"
                            style={{
                              width: `${resume.analysis.overallScore}%`,
                              background: getScoreColor(resume.analysis.overallScore),
                            }}
                          />
                        </div>
                        <span
                          className="mini-score-value"
                          style={{ color: getScoreColor(resume.analysis.overallScore) }}
                        >
                          {resume.analysis.overallScore}/100
                        </span>
                      </div>
                    )}

                    <div className="resume-card-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/analyzer/${resume._id}`)}
                        id={`view-${resume._id}`}
                      >
                        {resume.status === 'completed' ? 'View Results' : 'Analyze'}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(resume._id)}
                        id={`delete-${resume._id}`}
                        style={{ padding: '8px 12px' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
