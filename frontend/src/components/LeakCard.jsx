import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function LeakCard({ leak }) {
  const navigate = useNavigate();

  return (
    <div className="leak-card">
      <div className="leak-header">
        <h3>{leak.title}</h3>

        <span className="leak-badge">
          {leak.severity}
        </span>
      </div>

      <div className="price-details">
        <div>
          <p>Category</p>

          <h4>{leak.category}</h4>
        </div>

        <div className="price-arrow">💳</div>

        <div>
          <p>Current Price</p>

          <h4 className="increase-price">
            ${Number(leak.amount).toFixed(2)}
          </h4>
        </div>
      </div>

      <div className="leak-info">
        <p>
          <strong>{leak.description}</strong>
        </p>
      </div>

      <button
        className="detail-btn"
        onClick={() => navigate(`/leak/${leak.id}`)}
      >
        View Details
      </button>
    </div>
  );
}

export default LeakCard;