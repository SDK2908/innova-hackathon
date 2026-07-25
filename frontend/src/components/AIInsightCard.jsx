import "../styles/aiInsightCard.css";

function AIInsightCard({ item }) {
  if (!item) return null;

  return (
    <div className="ai-insight-card">

      <h2>🤖 SubscriptionIQ AI Report</h2>

      <div className="summary-section">
        <h3>Executive Summary</h3>
        <p>{item.executiveSummary}</p>
      </div>

      <div className="health-section">
        <h3>Portfolio Health</h3>

        <span className="health-badge">
          {item.overallPortfolioHealth}
        </span>
      </div>

      <div className="ai-grid">

        <div className="issues-section">
          <h3>⚠ Top Issues</h3>

          {item.topIssues?.length ? (
            <ul>
              {item.topIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          ) : (
            <p>No major issues detected.</p>
          )}
        </div>

        <div className="recommendations-section">
          <h3>✅ Recommendations</h3>

          {item.recommendations?.length ? (
            <ul>
              {item.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>

      </div>

      <div className="final-section">
        <h3>🎯 Final Recommendation</h3>
        <p>{item.finalRecommendation}</p>
      </div>

    </div>
  );
}

export default AIInsightCard;