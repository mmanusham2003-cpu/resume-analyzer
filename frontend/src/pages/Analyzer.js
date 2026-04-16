import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ResumeUpload from '../components/ResumeUpload';
import AnalysisResult from '../components/AnalysisResult';
import {
  uploadResume,
  analyzeResume,
  getResumeById,
} from '../services/resumeService';
import './Analyzer.css';

const Analyzer = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  const loadResume = async (resumeId) => {
    setLoading(true);
    try {
      const data = await getResumeById(resumeId);
      setResume(data);
    } catch (error) {
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, jobDescription) => {
    setIsUploading(true);
    try {
      // Step 1: Upload
      const uploaded = await uploadResume(file, jobDescription);
      toast.success('Resume uploaded! Starting analysis...');

      setResume(uploaded);
      setIsUploading(false);
      setIsAnalyzing(true);

      // Step 2: Analyze
      const analyzed = await analyzeResume(uploaded._id);
      setResume(analyzed);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleReAnalyze = async () => {
    if (!resume) return;
    setIsAnalyzing(true);
    try {
      const analyzed = await analyzeResume(resume._id);
      setResume(analyzed);
      toast.success('Re-analysis complete!');
    } catch (error) {
      toast.error('Re-analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewUpload = () => {
    setResume(null);
  };

  if (loading) {
    return (
      <div className="analyzer-page">
        <div className="container">
          <div className="loading-center" style={{ paddingTop: '120px' }}>
            <div className="spinner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analyzer-page" id="analyzer-page">
      <div className="container">
        <div className="analyzer-header">
          <h1 className="analyzer-title">Resume Analyzer</h1>
          <p className="analyzer-subtitle">
            Upload your resume and get AI-powered feedback in seconds
          </p>
        </div>

        {!resume ? (
          <ResumeUpload onUpload={handleUpload} isUploading={isUploading} />
        ) : (
          <div className="analyzer-results">
            {/* Controls */}
            <div className="analyzer-controls">
              <button
                className="btn btn-secondary"
                onClick={handleNewUpload}
                id="new-upload-btn"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                New Upload
              </button>

              {resume.status !== 'completed' && (
                <button
                  className="btn btn-primary"
                  onClick={handleReAnalyze}
                  disabled={isAnalyzing}
                  id="analyze-btn"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Now'
                  )}
                </button>
              )}
            </div>

            {/* Analyzing state */}
            {isAnalyzing && (
              <div className="analyzing-overlay glass-card">
                <div className="analyzing-content">
                  <div className="analyzing-spinner">
                    <div className="spinner" style={{ width: 48, height: 48 }} />
                  </div>
                  <h3>AI is analyzing your resume...</h3>
                  <p className="analyzing-text">
                    Evaluating content, formatting, keywords, and more. This may take a moment.
                  </p>
                  <div className="analyzing-steps">
                    <div className="step-item active">
                      <span className="step-dot" />
                      <span>Parsing document</span>
                    </div>
                    <div className="step-item active">
                      <span className="step-dot" />
                      <span>Extracting text</span>
                    </div>
                    <div className="step-item active">
                      <span className="step-dot" />
                      <span>Running AI analysis</span>
                    </div>
                    <div className="step-item">
                      <span className="step-dot" />
                      <span>Generating report</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {resume.status === 'completed' && resume.analysis && (
              <AnalysisResult
                analysis={resume.analysis}
                matchScore={resume.matchScore}
                fileName={resume.fileName}
              />
            )}

            {/* Failed state */}
            {resume.status === 'failed' && (
              <div className="failed-state glass-card">
                <h3>Analysis Failed</h3>
                <p>Something went wrong. Please try re-analyzing or upload a new resume.</p>
                <button className="btn btn-primary" onClick={handleReAnalyze} id="retry-analyze-btn">
                  Retry Analysis
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;
