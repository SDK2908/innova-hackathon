import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResolveModal from "./ResolveModal";
import "../styles/dashboard.css";

function LeakCard({ leak }) {
  const navigate = useNavigate();
  const [showResolve, setShowResolve] = useState(false);

  const savings =
    leak.previousAmount && leak.previousAmount > leak.amount
      ? (leak.previousAmount - leak.amount).toFixed(2)
      : "0.00";

  const handleViewDetails = () => {
    navigate(`/leak/${leak.id}`, {
      state: {
        leak,
      },
    });
  };

  return (
    <>
      <div className="leak-card">
        <div className="leak-header">
          <div>
            <h3>{leak.title}</h3>
            <p className="merchant-category">{leak.category}</p>
          </div>

          <span className="leak-badge">
            {leak.severity}
          </span>
        </div>

        <div className="price-details">
          <div>
            <p>Current Price</p>

            <h4 className="increase-price">
              ${Number(leak.amount).toFixed(2)}
            </h4>
          </div>

          <div className="price-arrow">💳</div>

          <div>
            <p>Potential Savings</p>

            <h4 className="saving-price">
              ${savings}
            </h4>
          </div>
        </div>

        <div className="leak-info">
          <p>{leak.description}</p>
        </div>

        <div className="leak-actions">

  <button
    className="detail-btn"
    onClick={handleViewDetails}
  >
    View Details
  </button>

  <button
    className="resolve-btn full-width"
    onClick={() => setShowResolve(true)}
  >
    Resolve Subscription
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

export default LeakCard;