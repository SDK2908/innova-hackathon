import { useState } from "react";
import "../styles/aiFinanceTeam.css";
import { analyzePortfolio } from "../services/api";

function AIFinanceTeam({ onAnalysisComplete }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");

  const runAnalysis = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not found.");
      return;
    }

    setLoading(true);

    const steps = [
      "Reading your subscription portfolio...",
      "Detecting recurring payment leaks...",
      "Checking for silent price hikes...",
      "Estimating potential savings...",
      "Generating personalized recommendations...",
      "Preparing executive financial report...",
    ];

    let currentStep = 0;

    setStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < steps.length) {
        setStep(steps[currentStep]);
      }
    }, 700);

    try {
      const response = await analyzePortfolio(userId);

      clearInterval(interval);

      setStep("Analysis completed successfully.");

      if (onAnalysisComplete) {
        onAnalysisComplete(response);
      }
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      alert("Unable to analyze subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-team-section">

      <div className="ai-main-card">

        <div className="ai-header">

          <div className="ai-logo">
            🤖
          </div>

          <div>

            <h2>SubscriptionIQ AI</h2>

            <p>
              Your intelligent subscription advisor powered by a
              multi-layered AI engine.
            </p>

          </div>

        </div>

        <div className="ai-info">

          <h3>What will be analyzed?</h3>

          <div className="ai-feature-grid">

            <div className="feature-card">
              💳
              <span>Recurring Payments</span>
            </div>

            <div className="feature-card">
              📈
              <span>Price Hikes</span>
            </div>

            <div className="feature-card">
              🔍
              <span>Hidden Subscriptions</span>
            </div>

            <div className="feature-card">
              💰
              <span>Potential Savings</span>
            </div>

            <div className="feature-card">
              📊
              <span>Spending Patterns</span>
            </div>

            <div className="feature-card">
              📄
              <span>Executive Report</span>
            </div>

          </div>

        </div>

        {loading && (

          <div className="analysis-progress">

            <div className="loader"></div>

            <h3>Analyzing Portfolio...</h3>

            <p>{step}</p>

          </div>

        )}

        <button
          className="analyze-btn"
          disabled={loading}
          onClick={runAnalysis}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Portfolio"}
        </button>

      </div>

    </div>
  );
}

export default AIFinanceTeam;