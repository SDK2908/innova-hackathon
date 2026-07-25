import { useState } from "react";
import "../styles/dashboard.css";

function ResolveModal({ leak, onClose }) {
  const [activeTab, setActiveTab] = useState("cancel");

  const cancelEmail = `Dear ${leak.title} Support,

I would like to cancel my subscription effective immediately.

Please ensure no future payments are charged to my account and confirm the cancellation.

Thank you.

Regards,
Account Holder`;

  const downgradeSuggestion = `Recommended Plan

• Switch to the Basic / Ad-Supported Plan.

Estimated Monthly Savings:
$${(Number(leak.amount) * 0.4).toFixed(2)}

This recommendation is based on your current subscription cost and usage pattern.`;

  const negotiateScript = `Hello,

I've been a loyal customer for quite some time.

I noticed that my subscription price has increased recently. Before cancelling, I'd like to know if there are any loyalty discounts, promotional offers, or lower-cost plans available.

Thank you!`;

  return (
    <div className="modal-overlay">
      <div className="resolve-modal">

        <div className="resolve-header">
          <div>
            <h2>{leak.title}</h2>
            <p>{leak.category}</p>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="resolve-price">
          <h3>
            Current Subscription Cost
          </h3>

          <h1>${Number(leak.amount).toFixed(2)}</h1>
        </div>

        <div className="resolve-tabs">

          <button
            className={activeTab === "cancel" ? "active-tab" : ""}
            onClick={() => setActiveTab("cancel")}
          >
            ❌ Cancel
          </button>

          <button
            className={activeTab === "downgrade" ? "active-tab" : ""}
            onClick={() => setActiveTab("downgrade")}
          >
            ⬇ Downgrade
          </button>

          <button
            className={activeTab === "renegotiate" ? "active-tab" : ""}
            onClick={() => setActiveTab("renegotiate")}
          >
            🤝 Renegotiate
          </button>

        </div>

        <div className="resolve-content">

          {activeTab === "cancel" && (
            <>
              <h3>Cancellation Email</h3>

              <textarea
                readOnly
                value={cancelEmail}
              />

              <button
                className="action-btn"
                onClick={() => navigator.clipboard.writeText(cancelEmail)}
              >
                Copy Email
              </button>
            </>
          )}

          {activeTab === "downgrade" && (
            <>
              <h3>Downgrade Recommendation</h3>

              <textarea
                readOnly
                value={downgradeSuggestion}
              />
            </>
          )}

          {activeTab === "renegotiate" && (
            <>
              <h3>Negotiation Script</h3>

              <textarea
                readOnly
                value={negotiateScript}
              />

              <button
                className="action-btn"
                onClick={() =>
                  navigator.clipboard.writeText(negotiateScript)
                }
              >
                Copy Script
              </button>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default ResolveModal;