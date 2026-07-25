import { useLocation, useNavigate } from "react-router-dom";
import "../styles/leakDetail.css";
import ActionTabs from "../components/ActionTabs";
function LeakDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const leak = location.state?.leak;

  if (!leak) {
    return (
      <div className="detail-container">
        <h2>Leak details not available.</h2>

        <button
          className="detail-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>{leak.title}</h1>

        <p>{leak.description}</p>
      </div>

      <div className="detail-summary">
        <div className="summary-card">
          <h3>Category</h3>

          <h2>{leak.category}</h2>
        </div>

        <div className="summary-card">
          <h3>Current Price</h3>

          <h2 className="danger">
            ${Number(leak.amount).toFixed(2)}
          </h2>
        </div>

        <div className="summary-card">
          <h3>Severity</h3>

          <h2 className="danger">
            {leak.severity}
          </h2>
        </div>
      </div>

      <div className="warning-box">
        {leak.description}
      </div>

      <ActionTabs />

      <button
        className="detail-btn"
        style={{ marginTop: "20px" }}
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default LeakDetail;