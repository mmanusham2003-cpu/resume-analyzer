import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ResumeUpload.css';

const ResumeUpload = ({ onUpload, isUploading }) => {
  const [jobDescription, setJobDescription] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0], jobDescription);
      }
    },
    [onUpload, jobDescription]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: isUploading,
  });

  return (
    <div className="upload-section" id="resume-upload-section">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${isUploading ? 'uploading' : ''}`}
        id="resume-dropzone"
      >
        <input {...getInputProps()} id="resume-file-input" />

        <div className="dropzone-icon">
          {isUploading ? (
            <div className="spinner" />
          ) : (
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect x="4" y="4" width="48" height="48" rx="12" fill="rgba(99, 102, 241, 0.1)" stroke="var(--color-accent-primary)" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M28 20v16M20 28h16" stroke="var(--color-accent-primary)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <div className="dropzone-text">
          {isUploading ? (
            <p className="dropzone-title">Uploading & Analyzing...</p>
          ) : isDragActive ? (
            <p className="dropzone-title">Drop your resume here</p>
          ) : (
            <>
              <p className="dropzone-title">
                Drag & drop your resume here
              </p>
              <p className="dropzone-subtitle">
                or <span className="dropzone-browse">browse files</span>
              </p>
              <p className="dropzone-hint">Supports PDF, DOCX — Max 5MB</p>
            </>
          )}
        </div>
      </div>

      <div className="job-description-section">
        <label htmlFor="job-description" className="jd-label">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 1v14M1 8h14" stroke="var(--color-accent-secondary)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Job Description (Optional)
        </label>
        <textarea
          id="job-description"
          className="input-field jd-textarea"
          placeholder="Paste the job description here to get a match score..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default ResumeUpload;
