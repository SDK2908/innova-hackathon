import { useLocation, useNavigate } from "react-router-dom";
import "../styles/agentResult.css";

function AgentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const agentName = location.state?.agentName || "AI Agent";
  const result = location.state?.result;

  return (
    <div className="agent-result-container">
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="agent-result-card">
        <h1>{agentName}</h1>

        <div className="result-content">
          {result ? (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "inherit",
                margin: 0,
              }}
            >
              {result}
            </pre>
          ) : (
            <p>No AI response available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentResult;