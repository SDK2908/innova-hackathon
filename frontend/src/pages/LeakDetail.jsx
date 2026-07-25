import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/leakDetail.css";
import ResolveModal from "../components/ResolveModal";
import PriceTrendChart from "../components/PriceTrendChart";

function LeakDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showResolve, setShowResolve] = useState(false);

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

  const previousPrice =
    leak.previousAmount || (Number(leak.amount) * 0.75).toFixed(2);

  const priceHike = (
    ((Number(leak.amount) - Number(previousPrice)) /
      Number(previousPrice)) *
    100
  ).toFixed(1);

  const leakScore = leak.score || 82;

  return (
    <>
      <div className="detail-container">

        <div className="detail-header">
          <div>
            <h1>{leak.title}</h1>
            <p>{leak.description}</p>
          </div>

          <button
            className="resolve-btn"
            onClick={() => setShowResolve(true)}
          >
            Resolve Subscription
          </button>
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
            <h3>Previous Price</h3>
            <h2>${previousPrice}</h2>
          </div>

          <div className="summary-card">
            <h3>Price Hike</h3>
            <h2 className="danger">
              {priceHike}%
            </h2>
          </div>

          <div className="summary-card">
            <h3>Leak Score</h3>
            <h2 className="danger">
              {leakScore}/100
            </h2>
          </div>

          <div className="summary-card">
            <h3>Status</h3>
            <h2 style={{ color: "#16a34a" }}>
              Active
            </h2>
          </div>

        </div>

    

        <PriceTrendChart
          leak={leak}
        />

        <div className="warning-box">

          <h3>🤖 AI Recommendation</h3>

          <p>
            Our AI has identified this subscription as a potential
            recurring payment leak. Based on your spending history,
            you should either cancel the subscription, downgrade to a
            lower-cost plan, or negotiate a better offer with the
            provider.
          </p>

        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >

      

          <button
            className="detail-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

        </div>

      </div>

      {showResolve && (
        <ResolveModal
          leak={leak}
          onClose={() => setShowResolve(false)}
        />
      )}
    </>
  );
}

export default LeakDetail;