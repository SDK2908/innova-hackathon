import "../styles/aiInsightCard.css";

function AIInsightCard({ item }) {
  if (!item) return null;

  return (
    <div className="ai-insight-card">

      <h2>🤖 SubscriptionIQ AI Report</h2>

      {/* Executive Summary */}
      <div className="summary-section">
        <h3>Executive Summary</h3>
        <p>{item.executiveSummary || "No summary available."}</p>
      </div>

      {/* Portfolio Health */}
      <div className="health-section">
        <h3>Portfolio Health</h3>

        <span className="health-badge">
          {item.overallPortfolioHealth || "Unknown"}
        </span>
      </div>

      <div className="ai-grid">

        {/* Top Issues */}
        <div className="issues-section">
          <h3>⚠ Top Issues</h3>

          {item.topIssues?.length ? (
            <ul>
              {item.topIssues.map((issue, index) => (
                <li key={index}>
                  {typeof issue === "string"
                    ? issue
                    : issue.issue || JSON.stringify(issue)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No major issues detected.</p>
          )}
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h3>✅ Recommendations</h3>

          {item.recommendations?.length ? (
            <ul>
              {item.recommendations.map((rec, index) => (
                <li key={index}>
                  {typeof rec === "string" ? (
                    rec
                  ) : (
                    <>
                      <strong>{rec.action}</strong>

                      {rec.reason && (
                        <>
                          <br />
                          <span>
                            <b>Reason:</b> {rec.reason}
                          </span>
                        </>
                      )}

                      {rec.priority && (
                        <>
                          <br />
                          <span>
                            <b>Priority:</b> {rec.priority}
                          </span>
                        </>
                      )}

                      {rec.estimatedYearlySavings !== undefined && (
                        <>
                          <br />
                          💰 Estimated Yearly Savings: $
                          {rec.estimatedYearlySavings}
                        </>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>

      </div>

      {/* Final Recommendation */}
      <div className="final-section">
        <h3>🎯 Final Recommendation</h3>

        <p>
          {item.finalRecommendation ||
            "Review duplicate subscriptions, downgrade expensive plans where possible, and enable renewal reminders to maximize savings."}
        </p>
      </div>

    </div>
  );
}

export default AIInsightCard;