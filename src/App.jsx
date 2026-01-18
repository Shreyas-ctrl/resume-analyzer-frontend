import { useState } from "react";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState("");
  const [dragging, setDragging] = useState(false);



  const analyzeResume = async () => {
  try {
    setLoading(true);
    setError(null);

    setStep("Parsing resume");
    setProgress(20);

    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch("https://resumeanalyzer-backend1.onrender.com/analyze-resume", {
      method: "POST",
      body: formData,
    });

    setStep("Analyzing skills");
    setProgress(50);

    if (!response.ok) {
      throw new Error("Failed to analyze resume");
    }

    const data = await response.json();

    setStep("Matching roles & learning path");
    setProgress(80);

    setResult(data);
    setProgress(100);
    setStep("Completed");
  } catch (err) {
    setError(err.message);
  } finally {
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      setStep("");
    }, 1000);
  }
};



  return (
    <div className="container">
      <div className="card">
        <h1>AI Resume Analyzer</h1>
        <p className="subtitle">
          Career guidance powered by multi-agent AI
        </p>

        <div className="upload-section">
  <label
    className={`upload-box ${dragging ? "dragging" : ""}`}
    onDragOver={(e) => {
      e.preventDefault();
      setDragging(true);
    }}
    onDragLeave={() => setDragging(false)}
    onDrop={(e) => {
      e.preventDefault();
      setDragging(false);
      setFile(e.dataTransfer.files[0]);
    }}
  >
    <div className="upload-icon">📄</div>
    <div>
      {file ? file.name : "Upload your resume (PDF)"}
    </div>

    <input
      type="file"
      accept=".pdf"
      hidden
      onChange={(e) => setFile(e.target.files[0])}
    />
  </label>

        <button onClick={analyzeResume} disabled={!file || loading}>
    {loading ? "Analyzing..." : "Analyze Resume"}
  </button>

  {loading && (
    <>
      <div className="step-progress">{step}</div>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </>
  )}
</div>


        {result && (
          <>
            <div className="section">
              <h3>Career Readiness</h3>
              <p>{result.job_readiness_score}% job-ready</p>
            </div>

            <div className="section">
              <h3>Recommended Roles</h3>
              {result.recommended_roles.map((r, i) => (
                <div className="role" key={i}>
                  <span>{r.role}</span>
                  <strong>{Math.round(r.match_score * 100)}%</strong>
                </div>
              ))}
            </div>

            <div className="section">
              <h3>Skill Gaps</h3>
              {result.skill_gaps.map((skill, i) => (
                <span className="badge" key={i}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="section">
              <h3>Learning Path</h3>
              <ul>
                {result.learning_path.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
  <footer
  style={{
    marginTop: "4rem",
    paddingTop: "1rem",
    borderTop: "1px solid #e0e0e0",
    fontSize: "0.85rem",
    color: "#666",
    textAlign: "center",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto"
  }}
>
  <p style={{ fontStyle: "italic", opacity: 0.85 }}>
    This tool is an AI-powered career guidance system designed to analyze resumes
    against generalized role expectations. It currently works best for commonly
    observed professional roles and skill sets. The insights provided are for
    learning, self-improvement, and career exploration only and do not represent
    hiring decisions or professional evaluations.
  </p>
</footer>
}


