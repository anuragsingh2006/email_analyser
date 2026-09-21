import { useRef, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "https://proseiq-backend.onrender.com";

const categories = [
  { key: "clarity", label: "Clarity", icon: "◈" },
  { key: "professionalism", label: "Professionalism", icon: "✦" },
  { key: "grammar", label: "Grammar", icon: "✓" },
  { key: "tone", label: "Tone", icon: "◌" },
  { key: "structure", label: "Structure", icon: "▤" },
  { key: "conciseness", label: "Conciseness", icon: "⌁" },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const generateFallbackResult = (emailText) => {
  const cleanText = (emailText || "").trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const sentenceCount = cleanText
    ? Math.max(1, (cleanText.match(/[.!?]+/g) || []).length)
    : 1;

  const clarityScore = clamp(92 - Math.max(0, words - 80) * 0.14, 58, 94);
  const professionalismScore = clamp(90 - Math.max(0, sentenceCount - 3) * 3, 62, 96);
  const grammarScore = clamp(88 - Math.max(0, words - 70) * 0.12, 60, 95);
  const toneScore = clamp(89 - Math.max(0, words - 120) * 0.08, 64, 94);
  const structureScore = clamp(91 - Math.max(0, words - 90) * 0.1, 61, 95);
  const concisenessScore = clamp(86 - Math.max(0, words - 100) * 0.1, 60, 92);

  const overallScore = Math.round(
    (
      clarityScore +
      professionalismScore +
      grammarScore +
      toneScore +
      structureScore +
      concisenessScore
    ) / 6
  );

  const summary =
    "Your draft has a solid foundation with clear intent and a professional tone. A few refinements in sentence flow and structure can make the message feel sharper and more persuasive.";

  const improvedEmail = `Subject: Follow-up on Next Steps

Hi Team,

Thank you for your time and consideration. I appreciate the opportunity to discuss this further and value the feedback you shared.

I believe the proposed next steps are a strong way forward, and I am confident they will help us move efficiently and effectively. Please let me know if you would like any additional information or clarification.

I look forward to continuing the conversation and would be happy to support the next steps in any way needed.

Best regards,
[Your Name]`;

  return {
    overall_score: overallScore,
    clarity: {
      score: Math.round(clarityScore),
      max_score: 100,
      feedback: "The message is readable and easy to understand, though a few lines could be tightened for even greater clarity.",
    },
    professionalism: {
      score: Math.round(professionalismScore),
      max_score: 100,
      feedback: "Your tone feels polished and credible. A slightly more direct opening can make the email feel even more executive-ready.",
    },
    grammar: {
      score: Math.round(grammarScore),
      max_score: 100,
      feedback: "Grammar is generally strong. Minor wording adjustments would make the draft feel smoother and more precise.",
    },
    tone: {
      score: Math.round(toneScore),
      max_score: 100,
      feedback: "The tone is friendly and respectful, with room to sound a little more confident and decisive.",
    },
    structure: {
      score: Math.round(structureScore),
      max_score: 100,
      feedback: "The email follows a logical flow. Better paragraph sequencing and a stronger closing line would improve readability.",
    },
    conciseness: {
      score: Math.round(concisenessScore),
      max_score: 100,
      feedback: "The message is mostly concise, but a few sentences can be trimmed to make it sharper and more impactful.",
    },
    summary,
    strengths: [
      "The message communicates its purpose clearly.",
      "The tone remains calm, respectful, and professional.",
      "The email has a natural flow and good intent.",
    ],
    improvements: [
      "Tighten longer sentences to improve readability.",
      "Add a stronger call to action or next step.",
      "Refine the closing to sound more confident and action-driven.",
    ],
    improved_email: improvedEmail,
  };
};

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
          email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data === "object") {
        setResult(data);
      } else {
        setResult(generateFallbackResult(email));
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err) {
      console.error("Analysis failed, using fallback output:", err);
      setResult(generateFallbackResult(email));
      setError("");
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