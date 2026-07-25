import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/aiFinanceTeam.css";
import { runAgent } from "../services/api";

const agents = [
  {
    key: "forensics",
    icon: "🕵️",
    title: "Financial Forensics",
    description: "Detects and verifies subscription issues.",
  },
  {
    key: "recovery",
    icon: "📈",
    title: "Recovery Strategist",
    description: "Prioritizes financial recovery actions.",
  },
  {
    key: "intelligence",
    icon: "🧠",
    title: "Subscription Intelligence",
    description: "Analyzes subscription portfolio overlaps.",
  },
  {
    key: "simulator",
    icon: "🔮",
    title: "Future Simulator",
    description: "Projects financial outcomes for different scenarios.",
  },
  {
    key: "resolution",
    icon: "🤝",
    title: "Resolution Assistant",
    description: "Prepares customer communication drafts.",
  },
  {
    key: "executive",
    icon: "🎯",
    title: "Executive Report",
    description: "Combines all AI outputs into one executive summary.",
  },
];

function AIFinanceTeam() {
  const navigate = useNavigate();

  const [loadingAgent, setLoadingAgent] = useState("");

  const handleRunAgent = async (agent) => {
    try {
      setLoadingAgent(agent.key);

      const response = await runAgent(
        agent.key,
        "Analyze the uploaded subscription data and generate your report."
      );

      navigate("/agent-result", {
        state: {
          agentName: agent.title,
          result: response.result.response,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Unable to run AI Agent.");
    } finally {
      setLoadingAgent("");
    }
  };

  return (
    <div className="ai-team-section">
      <h2>🤖 AI Finance Team</h2>

      <p>
        Our specialized AI agents collaborate to analyze your subscriptions,
        identify savings opportunities, and generate a complete recovery plan.
      </p>

      <div className="agent-grid">
        {agents.map((agent) => (
          <div key={agent.key} className="agent-card">
            <div className="agent-icon">{agent.icon}</div>

            <h3>{agent.title}</h3>

            <p>{agent.description}</p>

            <button
              onClick={() => handleRunAgent(agent)}
              disabled={loadingAgent === agent.key}
            >
              {loadingAgent === agent.key
                ? "Running..."
                : "Run Agent"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIFinanceTeam;