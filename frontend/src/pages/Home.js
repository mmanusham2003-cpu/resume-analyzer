import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const heroRef = useRef(null);

  /* Parallax-style floating dots on mouse move */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMove = (e) => {
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (clientX - cx) / cx;
      const dy = (clientY - cy) / cy;
      hero.style.setProperty('--mx', dx);
      hero.style.setProperty('--my', dy);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="home-page" ref={heroRef}>
      {/* ——— Decorative orbs ——— */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ——— Hero Section ——— */}
      <section className="hero-section" id="hero">
        <div className="container hero-grid">
          <div className="hero-left">
            <span className="hero-badge">
              <span className="badge-dot" />
              AI-Powered Resume Analysis
            </span>

            <h1 className="hero-heading">
              Land Your Dream Job with a<br />
              <span className="gradient-text">Perfect Resume</span>
            </h1>

            <p className="hero-description">
              Upload your resume and let our AI engine analyze formatting, keywords,
              experience, and skills — then get actionable suggestions to stand out
              from the competition.
            </p>

            <div className="hero-actions">
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary hero-btn" id="hero-dashboard">
                    Go to Dashboard
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link to="/analyzer" className="btn btn-secondary hero-btn" id="hero-analyze">
                    Analyze Resume
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary hero-btn" id="hero-get-started">
                    Get Started Free
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link to="/login" className="btn btn-secondary hero-btn" id="hero-login">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Social proof */}
            <div className="hero-proof">
              <div className="proof-avatars">
                <span className="proof-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>R</span>
                <span className="proof-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>A</span>
                <span className="proof-avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>K</span>
                <span className="proof-avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>S</span>
              </div>
              <span className="proof-text">Trusted by <strong>2,000+</strong> job seekers</span>
            </div>
          </div>

          {/* Animated card preview */}
          <div className="hero-right">
            <div className="preview-card glass-card">
              <div className="preview-header">
                <div className="preview-dots">
                  <span /><span /><span />
                </div>
                <span className="preview-label">resume_analysis.ai</span>
              </div>

              <div className="preview-body">
                {/* Animated score ring */}
                <div className="preview-ring-wrap">
                  <svg className="preview-ring" width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle
                      className="ring-progress"
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="264"
                      strokeDashoffset="46"
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366f1" />
                        <stop offset="1" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <text x="50" y="46" textAnchor="middle" fill="#f1f5f9" fontSize="22" fontWeight="800" fontFamily="Inter, sans-serif">83</text>
                    <text x="50" y="62" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500" fontFamily="Inter, sans-serif">OVERALL</text>
                  </svg>
                </div>

                {/* Animated bars */}
                <div className="preview-bars">
                  {[
                    { label: 'Formatting', pct: 92, color: '#10b981' },
                    { label: 'Experience', pct: 78, color: '#3b82f6' },
                    { label: 'Skills', pct: 85, color: '#a78bfa' },
                    { label: 'Keywords', pct: 70, color: '#f59e0b' },
                  ].map((item) => (
                    <div key={item.label} className="preview-bar-row">
                      <span className="preview-bar-label">{item.label}</span>
                      <div className="preview-bar-track">
                        <div
                          className="preview-bar-fill"
                          style={{ '--bar-width': `${item.pct}%`, '--bar-color': item.color }}
                        />
                      </div>
                      <span className="preview-bar-value" style={{ color: item.color }}>{item.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating keyword tags */}
              <div className="preview-tags">
                {['React', 'Node.js', 'Leadership', 'Agile'].map((tag) => (
                  <span key={tag} className="preview-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Floating notification */}
            <div className="floating-notif glass-card">
              <div className="notif-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />
                  <path d="M6 10l3 3 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="notif-text">
                <strong>Score improved!</strong>
                <span>+12 points after edits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Features Section ——— */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="features-header">
            <span className="section-badge">Features</span>
            <h2 className="section-title">Everything You Need to <span className="gradient-text">Stand Out</span></h2>
            <p className="section-description">
              Our AI analyzes every aspect of your resume — from structure and keywords
              to job-specific matching — so you know exactly what to improve.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" rx="6" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="1.5" />
                    <path d="M10 10h8M10 14h6M10 18h4" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Smart Parsing',
                desc: 'Extracts and understands text from PDF and DOCX files with high accuracy.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="1.5" />
                    <path d="M9 14l3 3 7-7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'AI-Powered Scoring',
                desc: 'Get a comprehensive score across formatting, skills, experience, and more.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" rx="6" fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1.5" />
                    <path d="M14 8v5l4 3" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Instant Feedback',
                desc: 'Receive detailed suggestions and improvements in seconds, not hours.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" rx="6" fill="rgba(124, 58, 237, 0.15)" stroke="#7c3aed" strokeWidth="1.5" />
                    <path d="M9 14h10M14 9v10" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Job Matching',
                desc: 'Compare your resume against any job description for a match score.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="11" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="1.5" />
                    <path d="M10 14l2-4 3 6 2-3 3 1" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Keyword Analysis',
                desc: 'See which keywords recruiters look for and whether your resume includes them.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" rx="6" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1.5" />
                    <path d="M14 9v6M14 19h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Issue Detection',
                desc: 'Catch formatting errors, missing sections, and common resume pitfalls.',
              },
            ].map((f, i) => (
              <div key={i} className="feature-card glass-card" id={`feature-${i}`}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— How It Works ——— */}
      <section className="steps-section" id="how-it-works">
        <div className="container">
          <div className="features-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Three Simple <span className="gradient-text">Steps</span></h2>
          </div>

          <div className="steps-grid">
            {[
              { num: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF or DOCX resume into the analyzer.', color: '#6366f1' },
              { num: '02', title: 'AI Analysis', desc: 'Our AI engine parses, scores, and evaluates every section.', color: '#10b981' },
              { num: '03', title: 'Get Results', desc: 'View your score, keyword matches, and improvement suggestions.', color: '#f59e0b' },
            ].map((step, i) => (
              <div key={i} className="step-card" id={`step-${i}`}>
                <span className="step-num" style={{ color: step.color }}>{step.num}</span>
                <div className="step-connector" />
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-card glass-card">
            <h2 className="cta-title">Ready to Upgrade Your Resume?</h2>
            <p className="cta-description">
              Join thousands of job seekers who improved their resumes and landed more interviews.
            </p>
            {user ? (
              <Link to="/analyzer" className="btn btn-primary hero-btn" id="cta-analyze">
                Analyze My Resume
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary hero-btn" id="cta-register">
                Start for Free
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand gradient-text">ResumeAI</span>
          <span className="footer-copy">© {new Date().getFullYear()} ResumeAI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
