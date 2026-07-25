import { useState } from "react";

function InsightCard({ title, content, success }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="insight-card">

      <div className="insight-header">

        <h3>{title}</h3>

        <span className={success ? "status-ok" : "status-error"}>
          {success ? "Completed" : "Failed"}
        </span>

      </div>

      <p className="preview">
        {content.substring(0, 180)}
        {content.length > 180 ? "..." : ""}
      </p>

      <button
        className="details-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Hide Details" : "View Details"}
      </button>

      {expanded && (
        <div className="full-content">
          <pre>{content}</pre>
        </div>
      )}

    </div>
  );
}

export default InsightCard;