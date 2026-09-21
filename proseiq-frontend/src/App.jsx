import { useRef, useState } from "react";
import "./App.css";

const API_URL = "https://proseiq-backend.onrender.com";

const categories = [
  { key: "clarity", label: "Clarity", icon: "◈" },
  { key: "professionalism", label: "Professionalism", icon: "✦" },
  { key: "grammar", label: "Grammar", icon: "✓" },
  { key: "tone", label: "Tone", icon: "◌" },
  { key: "structure", label: "Structure", icon: "▤" },
  { key: "conciseness", label: "Conciseness", icon: "⌁" },
];

function App() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const resultsRef = useRef(null);

  const analyzeEmail = async () => {
    if (!email.trim()) {
      setError("Please write or paste an email first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setResult(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to ProseIQ backend. Please make sure the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setEmail("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const copyEmail = async () => {
    if (!result?.improved_email) return;

    try {
      await navigator.clipboard.writeText(result.improved_email);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Could not copy the email. Please copy it manually.");
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="navbar">
        <div className="nav-inner">
          <div className="logo-area">
            

            <div>
              <div className="logo-text">ProseIQ</div>
              <div className="logo-subtitle">
                Write Better. Communicate Better.
              </div>
            </div>
          </div>

          <div className="nav-pill">
            <span className="status-dot"></span>
            AI Communication Intelligence
          </div>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="hero">
          <div className="hero-badge">
            <span>✦</span>
            AI-POWERED COMMUNICATION INTELLIGENCE
          </div>

          <h1 className="hero-title">
            Write with <span>clarity.</span>
            <br />
            Communicate with <span>confidence.</span>
          </h1>

          <p className="hero-description">
            ProseIQ analyzes your email across clarity, professionalism,
            grammar, tone, structure, and conciseness.
          </p>
        </section>

        {/* ANALYZER */}
        <section className="analyzer-section">
          <div className="section-heading">
            <div className="eyebrow">EMAIL ANALYZER</div>

            <h2>Polish your message</h2>

            <p>
              Write or paste your email below and let ProseIQ analyze it.
            </p>
          </div>

          <div className="editor-card">
            <div className="editor-top">
              <div className="editor-label">
                <span className="mail-icon">✉</span>
                Your email
              </div>

              <div className="character-count">
                {email.length.toLocaleString()} characters
              </div>
            </div>

            <textarea
              className="email-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Write or paste your email here..."
              spellCheck="true"
            />

            <div className="editor-footer">
              <div className="editor-hint">
                ProseIQ evaluates six dimensions of communication.
              </div>

              <div className="editor-actions">
                <button
                  type="button"
                  className="clear-btn"
                  onClick={clearAll}
                  disabled={!email && !result}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="analyze-btn"
                  onClick={analyzeEmail}
                  disabled={!email.trim() || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Email
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-box">
              <div className="error-icon">!</div>

              <div className="error-content">
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>

              <button
                type="button"
                onClick={analyzeEmail}
                disabled={!email.trim() || loading}
              >
                Try again
              </button>
            </div>
          )}

          {loading && (
            <div className="loading-card">
              <div className="loading-spinner"></div>

              <div>
                <strong>Analyzing your communication...</strong>
                <p>
                  ProseIQ is reviewing your email across six communication
                  dimensions.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* RESULTS */}
        {result && (
          <section className="results-section" ref={resultsRef}>
            <div className="results-heading">
              <div>
                <div className="eyebrow">ANALYSIS COMPLETE</div>
                <h2>Your communication report</h2>
                <p>
                  Here is how your email performs across six key dimensions.
                </p>
              </div>

              <button type="button" className="new-email-btn" onClick={clearAll}>
                Analyze another email
              </button>
            </div>

            {/* SCORE */}
            <div className="score-card">
              <div className="score-ring-wrap">
                <div
                  className="score-ring"
                  style={{
                    "--score": `${result.overall_score || 0}%`,
                  }}
                >
                  <div className="score-inner">
                    <strong>{result.overall_score || 0}</strong>
                    <span>/100</span>
                  </div>
                </div>
              </div>

              <div className="score-info">
                <div className="score-label">OVERALL SCORE</div>
                <h3>Your email has been analyzed.</h3>
                <p>
                  Review the detailed feedback below to understand what works
                  and where your communication can become stronger.
                </p>
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="categories-grid">
              {categories.map((category) => {
                const item = result[category.key];

                if (!item) return null;

                const percentage =
                  item.max_score > 0
                    ? Math.round((item.score / item.max_score) * 100)
                    : 0;

                return (
                  <div className="category-card" key={category.key}>
                    <div className="category-top">
                      <div className="category-icon">{category.icon}</div>

                      <div className="category-score">
                        <strong>{item.score}</strong>
                        <span>/{item.max_score}</span>
                      </div>
                    </div>

                    <h3>{category.label}</h3>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <p>{item.feedback}</p>
                  </div>
                );
              })}
            </div>

            {/* SUMMARY */}
            <div className="content-card summary-card">
              <div className="card-heading">
                <div className="card-icon">◎</div>

                <div>
                  <div className="eyebrow">OVERVIEW</div>
                  <h2>Overall Analysis</h2>
                </div>
              </div>

              <p>{result.summary}</p>
            </div>

            {/* STRENGTHS + IMPROVEMENTS */}
            <div className="two-column">
              <div className="content-card">
                <div className="card-heading">
                  <div className="card-icon success">✓</div>

                  <div>
                    <div className="eyebrow">STRENGTHS</div>
                    <h2>What You Did Well</h2>
                  </div>
                </div>

                <div className="bullet-list">
                  {(result.strengths || []).map((item, index) => (
                    <div className="bullet-item" key={index}>
                      <span className="bullet-check">✓</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-card">
                <div className="card-heading">
                  <div className="card-icon warning">↗</div>

                  <div>
                    <div className="eyebrow">OPPORTUNITIES</div>
                    <h2>How You Can Improve</h2>
                  </div>
                </div>

                <div className="bullet-list">
                  {(result.improvements || []).map((item, index) => (
                    <div className="bullet-item" key={index}>
                      <span className="bullet-number">{index + 1}</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* IMPROVED EMAIL */}
            <div className="improved-card">
              <div className="improved-header">
                <div>
                  <div className="eyebrow">AI REWRITE</div>
                  <h2>AI-Improved Email</h2>
                  <p>
                    A polished version based on ProseIQ's communication
                    analysis.
                  </p>
                </div>

                <button
                  type="button"
                  className="copy-btn"
                  onClick={copyEmail}
                >
                  {copied ? "✓ Copied!" : "Copy Email"}
                </button>
              </div>

              <div className="improved-email">
                {result.improved_email}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-logo">P</div>

          <div>
            <strong>ProseIQ</strong>
            <span>Write Better. Communicate Better.</span>
          </div>
        </div>

        <div className="footer-text">
          AI-powered communication intelligence
        </div>
      </footer>
    </div>
  );
}

export default App;